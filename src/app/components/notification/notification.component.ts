import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notifications: any[] = [];
  userId: any = localStorage.getItem('userId');;
  loading: boolean = false;
  error: string | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = null;
    this.notificationService.getNotifications(this.userId).subscribe({
      next: (data: any[]) => {
        this.notifications = data;
        console.log(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.error = 'Failed to load notifications';
        this.loading = false;
      }
    });
  }

  markRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        );
      },
      error: (err) => {
        console.error('Error marking as read:', err);
      }
    });
  }
}
