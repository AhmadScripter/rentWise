import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  notifications: any[] = [];
  userId: string = '';

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('userId') || '';
    }
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
    if (this.userId) {
      this.notificationService.getNotifications(this.userId).subscribe(data => {
        this.notifications = data.filter((n: any) => !n.isRead);
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

}
