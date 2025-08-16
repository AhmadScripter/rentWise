import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  imports: [FormsModule, CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.getUserBooking()
    console.log('Fetched bookings:', this.bookings);

  }

  getUserBooking() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.bookingService.getUserBookings(userId).subscribe({
        next: (res: any) => {
          console.log('Bookings received:', res);
        
          this.bookings = [...res].sort((a, b) => {
            const priority: Record<string, number> = { pending: 1, confirmed: 2, completed: 3, cancelled: 4 };
            return (priority[a.status?.toLowerCase()] ?? 999) 
                 - (priority[b.status?.toLowerCase()] ?? 999);
          });
          
        },
        error: err => console.log("Error fetching bookings")
      });
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'text-warning';
      case 'Confirmed': return 'text-success';
      case 'Completed': return 'text-primary';
      case 'Cancelled': return 'text-danger';
      default: return '';
    }
  }

  cancelBooking(id: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe(() => {
        this.getUserBooking();
      });
    }
  }
}
