import { Component, OnInit, ViewChild } from '@angular/core';
import { RuleModel, QueryBuilderComponent as mQueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
interface Field{
  value: string
  label: string
  type: string
  values?: any[]
  format?: string
}
@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  isLoadingResults: boolean = false
  data: any[] = []
  json: string
  @ViewChild('querybuilder')
  public qryBldrObj: mQueryBuilderComponent
  values: string[] = ['Mr.', 'Mrs.']
  fields: Field[] = [
    {
      value: "usuario.nombre",
      label: "Nombre de usuario",
      type: "string"
    },
    {
      value: "usuario.edad",
      label: "Edad de usuario",
      type: "number"
    },
    {
      value: "usuario.fecha_ingreso",
      label: "Fecha de ingreso de usuario",
      type: "date",
      format: "yyyy-mm-dd"
    },
    {
      value: "usuario.cargo",
      label: "Cargo de usuario",
      type: "boolean",
      values: [
        "Administrador",
        "Cajero",
        "Conductor",
        "Operador"
      ]
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  onQueryChange(event: any){
    console.log('query changed', event)
    this.json = JSON.stringify({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules }, null, 4)
  }
}
