import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  admin = {
    email: '',
    password: ''
  }
  errorMsg: string = '';

  constructor(private router: Router, private adminService: AdminService){}

  loginAdmin() {
    this.adminService.login(this.admin).subscribe({
      next: (res: any) => {
        localStorage.setItem('adminToken', res.token);
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error.message || 'Login failed';
      }
    });
  }
}
