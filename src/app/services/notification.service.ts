import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:3000/api/notifications';

  constructor(private http: HttpClient) { }

  getNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/read/${notificationId}`, {});
  }

  createNotification(data: { userId: string, message: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
