import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  @Input() element: any;
  @Input() title: any;
  @Input() type: string;
  @Input() format: string;
  @Input() headers: string[];
  properties: any[];
  modelMap: any;
  tableHeaders: any[];
  rows: any[];
  keys: string[];
  constructor(private utilities: UtilitiesService, private activatedRoute: ActivatedRoute) {
    // this.init();
  }

  init() {
    console.log('type', this.type);
    console.log('element', this.element);
    this.properties = [];
    this.modelMap = this.utilities.dataTypesModelMaps[this.type];
    console.log('modelMap', this.modelMap);
    if (Array.isArray(this.element)) {
      this.keys = this.headers.slice();
      const newHeaders = [];
      for (let key of this.keys) {
        if (1) {
          if (this.modelMap[key] && this.modelMap[key].name) {
            newHeaders.push(this.modelMap[key].name);
          } else {
            console.error('header in model map not present ');
          }
        }
      }
      this.tableHeaders = newHeaders;
      console.log('modelMap', this.modelMap);
      console.log('headers', this.headers);
      this.rows = this.element;
      console.log('rows', this.rows);
    } else {
      for (let key in this.modelMap) {
        if (1) {
          if (typeof this.element[key] !== 'object') {
            this.properties.push({ label: this.modelMap[key].name, value: this.element[key]});
          }
        }
      }
      console.log('print properties', this.properties);
    }
    console.log('print init element', this.element);
  }

  renderColumn(type: string, data: any) {
    console.log(`rendering type: ${type}, value: `, data);
    return this.utilities.renderColumnData(type, data);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {
      row: any
      type: string,
      format: string,
      title: string
    }) => {
      this.type = data.type;
      data.row.subscribe(element => {
        console.log('element suscribed', element);
        if (element.content && element.content[0]) {
          this.element = element.content[0];
        } else if (element) {
          this.element = element;
        }
        this.init();
        setTimeout(() => {
          window.print();
          //window.close();
        }, 1000);
      });
      this.format = data.format;
      this.title = data.title;
    });
  }

}
