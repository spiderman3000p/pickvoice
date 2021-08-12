import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var SockJS;
declare var Stomp;
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public subject = new Subject<any>();
  public mensaje = {};
  constructor() {
    this.initializeWebSocketConnection();
  }
  public stompClient;
  public msg = [];
  initializeWebSocketConnection() {
    console.log('Inicializando websocket...');
    const serverUrl = 'https://api.dev.pickvoice.com/gs-guide-websocket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, (frame) => {
      that.stompClient.subscribe('/topic/counts', (message) => {
        //console.log('mensaje recibido en servicio', message);
        //console.log('mensaje recibido en servicio parseado ', JSON.parse(message.body));
        this.mensaje = JSON.parse(message.body);
        this.subject.next(JSON.parse(message.body));
      });
    });
    setTimeout(() => {
        this.subject.next({taskId: 4, taskLineId: 9, qtySelected: 5});
    }, 5000);
    setTimeout(() => {
        this.subject.next({taskId: 4, taskLineId: 10, qtySelected: 10});
    }, 10000);
    setTimeout(() => {
        this.subject.next({taskId: 4, taskLineId: 9, qtySelected: 8});
    }, 8000);
  }

  sendMessage(message) {
    this.stompClient.send('/topic/counts' , {}, message);
  }
}