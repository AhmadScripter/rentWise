import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-users',
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {

  users: any[] = [];
  errMsg = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errMsg = err.error?.message || 'Failed to load users';
      }
    });
  }

}
