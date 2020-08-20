import { Component, OnInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { AuthService } from '../../services/auth.service';

import { Validators, FormGroup, FormControl } from '@angular/forms';
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
  isLoadingResults = true;
  cities: City[] = [];
  plants = [];
  depots = [];
  owners = [];
  userData: UserData;
  form: FormGroup;
  constructor(private activatedRoute: ActivatedRoute, private utilities: UtilitiesService,
              private authService: AuthService, private router: Router) {
    this.userData = new Object() as UserData;
  }

  ngOnInit() {
    this.form = new FormGroup({
      selectedCity: new FormControl(0, [Validators.required]),
      selectedPlant: new FormControl(0, [Validators.required]),
      selectedDepot: new FormControl(0, [Validators.required]),
      selectedOwner: new FormControl(0, [Validators.required])
    });
    this.activatedRoute.data.subscribe((data: {
      data: any
    }) => {
      if (data) {
        data.data.subscribe(resp => {
          this.utilities.log('member data response: ', resp);
          if (resp && Array.isArray(resp) && resp.length > 0 && resp[0].id) {
            this.isLoadingResults = false;
            this.utilities.log('member data: ', resp);
            this.fillUserData(resp);
            this.utilities.log('generated data: ', this.cities);
            this.form.get('selectedCity').valueChanges.subscribe(value => {
              this.plants = this.cities[value].plants;
              this.form.get('selectedPlant').patchValue(0);
            });
            this.form.get('selectedPlant').valueChanges.subscribe(value => {
              const city = this.form.get('selectedCity').value;
              this.depots = this.cities[city].plants[value].depots;
              this.form.get('selectedDepot').patchValue(0);
            });
            this.form.get('selectedDepot').valueChanges.subscribe(value => {
              const city = this.form.get('selectedCity').value;
              const plant = this.form.get('selectedPlant').value;
              this.owners = this.cities[city].plants[plant].depots[value].owners;
              this.form.get('selectedOwner').patchValue(0);
            });
            this.form.get('selectedCity').patchValue(0);
            this.form.get('selectedPlant').patchValue(0);
            this.form.get('selectedDepot').patchValue(0);
            this.form.get('selectedOwner').patchValue(0);
          } else {
            this.isLoadingResults = false;
            console.error('No hay usuarios registradoscon esos credenciales');
            this.logout();
            this.utilities.showSnackBar('User doesnt exist', 'OK');
          }
        }, err => {
          this.isLoadingResults = false;
          console.error('Error al obtener datos del usuario logueado');
          this.logout();
          this.utilities.showSnackBar('Error getting user information', 'OK');
        });
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(result => {
      this.utilities.log('logout response', result);
      if (result) {
        this.utilities.log('redirecting to /');
        this.router.navigate(['/login']);
      }
    }, error => {
      this.utilities.log('error on logout');
      this.utilities.showSnackBar('Error requesting logout', 'OK');
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
    }
  }

  getPlants() {
    const selectedCity = this.form.get('selectedCity').value;
    this.utilities.log('selected city: ', selectedCity);
    if (this.cities && selectedCity !== undefined && this.cities[selectedCity]) {
      return this.cities[selectedCity].plants;
    }
    return [];
  }

  getDepots() {
    const selectedCity = this.form.get('selectedCity').value;
    const selectedPlant = this.form.get('selectedPlant').value;
    if (this.cities && selectedCity !== undefined && this.cities[selectedCity] &&
        selectedPlant !== undefined && this.cities[selectedCity].plants[selectedPlant]) {
      return this.cities[selectedCity].plants[selectedPlant].depots;
    }
    return [];
  }

  getOwners() {
    const selectedCity = this.form.get('selectedCity').value;
    const selectedPlant = this.form.get('selectedPlant').value;
    const selectedDepot = this.form.get('selectedDepot').value;
    if (this.cities && this.cities[selectedCity] &&
        this.cities[selectedCity].plants[selectedPlant] &&
        this.cities[selectedCity].plants[selectedPlant]
        .depots[selectedDepot]) {
      this.utilities.log('retornando owners: ', this.cities[selectedCity]
      .plants[selectedPlant].depots[selectedDepot].owners);
      return this.cities[selectedCity]
      .plants[selectedPlant].depots[selectedDepot].owners;
    }
    return [];
  }

  setUserData() {
    this.userData = new Object() as UserData;
    let city: City;
    let plant: Plant;
    let depot: Depot;
    let owner: Owner;
    const selectedCity = this.form.get('selectedCity').value;
    const selectedPlant = this.form.get('selectedPlant').value;
    const selectedDepot = this.form.get('selectedDepot').value;
    const selectedOwner = this.form.get('selectedOwner').value;
    if (selectedCity !== undefined) {
      city = this.cities[selectedCity];
      this.userData.cityId = city.id;
      this.userData.cityName = city.name;
    }
    if (selectedPlant !== undefined && city !== undefined) {
      plant = city.plants[selectedPlant];
      this.userData.plantId = plant.id;
      this.userData.plantName = plant.name;
    }
    if (selectedDepot !== undefined && plant !== undefined) {
      depot = plant.depots[selectedDepot];
      this.userData.depotId = depot.id;
      this.userData.depotName = depot.name;
    }
    if (selectedOwner !== undefined && depot !== undefined) {
      owner = depot.owners[selectedOwner];
      this.userData.ownerId = owner.id;
      this.userData.ownerName = owner.name;
    }
  }

  onSubmit() {
    this.setUserData();
    this.utilities.log('userData: ', this.userData);
    this.authService.setUserMemberData(this.userData);
    this.router.navigate(['/pages/dashboard']);
  }
}
