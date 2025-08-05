import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  updateBooking(bookingId: string, bookingData:any){
    return this.http.put(`${this.apiURL}/status/${bookingId}`, bookingData)
  }

  cancelBooking(bookingId:string){
    return this.http.put(`${this.apiURL}/cancel/${bookingId}`, {})
  }
}
