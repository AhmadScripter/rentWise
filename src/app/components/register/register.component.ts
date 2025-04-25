import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  // Custom validator to check if passwords match
  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  // Handle form submission
  register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.error = '';

    const { name, email, password, confirmPassword } = this.registerForm.value;

    this.authService.register(name, email, password, confirmPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isLoading = false;
        this.router.navigate(['/verify-otp'], { queryParams: { email } });
      },
      error: (err) => {
        this.error = err.error.message || 'Something went wrong!';
        this.isLoading = false;
      }
    });
  }

  login(){
    this.router.navigate(['/login']);
  }
}
