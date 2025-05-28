import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from './services/websocket';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NzButtonModule, NzInputModule, NzFormModule, NzAlertModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  messages: any[] = [];
  text: string = '';
  private messageSubscription?: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.messageSubscription = this.webSocketService.getMessages().subscribe(message => {
      console.log('Received message:', message);
      this.messages.push(message);
      
    });
  }

  sendMessage() {
    if (!this.text.trim()) {
      return;
    }
    const message = this.text;
    this.webSocketService.sendMessage({message:message});
    this.text = '';
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
    this.webSocketService.closeConnection();
  }
}