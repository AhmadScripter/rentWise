import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiURL = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) { }

  getUserBookings(userId: string) {
    return this.http.get(`${this.apiURL}/user/${userId}`);
  }

  createBooking(bookingData: any) {
    return this.http.post(`${this.apiURL}/`, bookingData);
  }

  // Approve a booking
  approveBooking(bookingId: string) {
    return this.http.put(`${this.apiURL}/${bookingId}/approve`, {});
  }

  cancelBooking(bookingId: string) {
    return this.http.put(`${this.apiURL}/${bookingId}/cancel`, {})
  }

  // Complete a booking
  completeBooking(bookingId: string) {
    return this.http.put(`${this.apiURL}/${bookingId}/complete`, {});
  }

  getOwnerBookings(ownerId: string) {
    return this.http.get<Booking[]>(`${this.apiURL}/owner/${ownerId}`);
  }
  
  getOwnerStats(ownerId: string) {
    return this.http.get(`${this.apiURL}/owner/${ownerId}/stats`);
  }
  
}
