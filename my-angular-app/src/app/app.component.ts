import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app.routes';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
}