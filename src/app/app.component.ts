import { Component } from '@angular/core';
import { MessageService } from './services/websocket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PickVoiceWarehouseAdmin';
  input;
  constructor(private messageService: MessageService) {

  }

  sendMessage() {
    if (this.input) {
      this.messageService.sendMessage(this.input);
      this.input = '';
    }
  }
}
