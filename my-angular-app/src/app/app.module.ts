import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MessageComponent } from './message/message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppRoutingModule, routes } from './app.routes';

@NgModule({
  declarations: [
    MessageComponent,
  ],
  imports: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
})
export class AppModule { }
