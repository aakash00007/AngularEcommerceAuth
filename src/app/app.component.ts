import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularAuthUI';

  constructor(private messageService:MessageService){}
}