import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-pasword-require',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-pasword-require.component.html',
  styleUrl: './new-pasword-require.component.css'
})
export class NewPaswordRequireComponent{
  currentpassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService : AuthService) {
  }

  confirmPasswordReset() {
    this.authService.changePassword(this.currentpassword, this.newPassword, this.confirmPassword)
  }
}