import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class ParseService {

  constructor(private papaService: Papa) { }

  parseText(text: string, config: any = null) {
    return this.papaService.parse(text, config);
  }

  parseFile(file: File, config: any = null) {
    return this.papaService.parse(file, config);
  }

  parseUrl(url: string, config: any = null) {
    return this.papaService.parse(url, config);
  }
}
