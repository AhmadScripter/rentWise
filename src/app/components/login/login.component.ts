import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem('authToken', response.token); 
        
        this.authService.setLoginStatus(true); 
        this.router.navigate(['/home']);
      },
      (err) => {
        this.error = err.error.message || 'Login failed';
        console.error(this.error);
      }
    );
  }
  
  signUp(){
    this.router.navigate(['/register']);
  }
}
