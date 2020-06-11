import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { AuthService } from '../../services/auth.service';
import { DataProviderService } from '../../services/data-provider.service';

import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { retry, takeLast } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, Observer, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

interface City {
  id: number;
  name: string;
  plants: Plant[];
}
interface Plant {
  id: number;
  name: string;
  depots: Depot[];
}
interface Depot {
  id: number;
  name: string;
  owners: Owner[];
}
interface Owner {
  id: number;
  name: string;
}
interface UserData {
  cityId: number;
  cityName: string;
  plantId: number;
  plantName: string;
  depotId: number;
  depotName: string;
  ownerId: number;
  ownerName: string;
}
@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.scss']
})
export class InitializeComponent implements OnInit {
  isLinear = false;
  username = 'user';
  isLoadingResults = true;
  cities: City[] = [];
  userData: UserData;
  selectedCity: FormControl;
  selectedPlant: FormControl;
  selectedDepot: FormControl;
  selectedOwner: FormControl;
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
              private utilities: UtilitiesService, private authService: AuthService,
              private router: Router) {
    this.userData = new Object() as UserData;
  }

  ngOnInit() {
    this.selectedCity = new FormControl(0, [Validators.required]);
    this.selectedPlant = new FormControl(0, [Validators.required]);
    this.selectedDepot = new FormControl(0, [Validators.required]);
    this.selectedOwner = new FormControl(0, [Validators.required]);
    this.activatedRoute.data.subscribe((data: {
      data: any
    }) => {
      if (data) {
        this.username = this.authService.getUsername();
        data.data.subscribe(resp => {
          this.utilities.log('member data response: ', resp);
          if (resp && Array.isArray(resp) && resp.length > 0 && resp[0].id) {
            this.isLoadingResults = false;
            this.utilities.log('member data: ', resp);
            this.fillUserData(resp);
          }
        });
      }
    });
  }

  fillUserData(data: any[]) {
    if (data && Array.isArray(data) && data.length > 0) {
      let auxCity;
      let auxPlant;
      let auxDepot;
      let auxOwner;
      let existentCityIndex;
      let existentPlantIndex;
      let existentDepotIndex;
      let existentOwnerIndex;
      // buscando cities
      data.forEach(element => {
        existentCityIndex = this.cities.findIndex(city => city.id === element.cityId);
        if (existentCityIndex === -1) {
          auxCity = new Object() as City;
          auxCity.id = element.cityId;
          auxCity.name = element.cityName;
          auxCity.plants = [];
          this.cities.push(auxCity);
        } else {
          auxCity = this.cities[existentCityIndex];
        }
        // buscando plants
        existentPlantIndex = auxCity.plants.findIndex(plant => plant.id === element.plantId);
        if (existentPlantIndex === -1) {
          auxPlant = new Object() as Plant;
          auxPlant.id = element.plantId;
          auxPlant.name = element.plantName;
          auxPlant.depots = [];
          auxCity.plants.push(auxPlant);
        } else {
          auxPlant = auxCity.plants[existentPlantIndex];
        }
        // buscando depots
        existentDepotIndex = auxPlant.depots.findIndex(depot => depot.id === element.depotId);
        if (existentDepotIndex === -1) {
          auxDepot = new Object() as Depot;
          auxDepot.id = element.depotId;
          auxDepot.name = element.depotName;
          auxDepot.owners = [];
          auxPlant.depots.push(auxDepot);
        } else {
          auxDepot = auxPlant.depots[existentDepotIndex];
        }
        existentOwnerIndex = auxDepot.owners.findIndex(owner => owner.id === element.ownerId);
        if (existentOwnerIndex === -1) {
          auxOwner = new Object() as Owner;
          auxOwner.id = element.ownerId;
          auxOwner.name = element.ownerName;
          auxDepot.owners.push(auxOwner);
        }
      });
      this.utilities.log('cities final: ', this.cities);
    }
  }

  getPlants() {
    if (this.cities && this.cities[this.selectedCity.value]) {
      return this.cities[this.selectedCity.value].plants;
    }
    return [];
  }

  getDepots() {
    if (this.cities && this.cities[this.selectedCity.value] &&
      this.cities[this.selectedCity.value].plants[this.selectedPlant.value]) {
      return this.cities[this.selectedCity.value].plants[this.selectedPlant.value].depots;
    }
    return [];
  }

  getOwners() {
    if (this.cities && this.cities[this.selectedCity.value] &&
        this.cities[this.selectedCity.value].plants[this.selectedPlant.value] &&
        this.cities[this.selectedCity.value].plants[this.selectedPlant.value]
        .depots[this.selectedDepot.value]) {
      return this.cities[this.selectedCity.value]
      .plants[this.selectedPlant.value].depots[this.selectedDepot.value].owners;
    }
    return [];
  }

  setUserData() {
    this.userData = new Object() as UserData;
    const city = this.cities[this.selectedCity.value];
    const plant = city.plants[this.selectedPlant.value];
    const depot = plant.depots[this.selectedDepot.value];
    const owner = depot.owners[this.selectedOwner.value];
    this.userData.cityId = city.id;
    this.userData.cityName = city.name;
    this.userData.plantId = plant.id;
    this.userData.plantName = plant.name;
    this.userData.depotId = depot.id;
    this.userData.depotName = depot.name;
    this.userData.ownerId = owner.id;
    this.userData.ownerName = owner.name;
  }

  enter() {
    this.authService.setUserMemberData(this.userData);
    this.router.navigate(['/pages/dashboard']);
  }
}
