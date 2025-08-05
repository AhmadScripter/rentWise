import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
declare var bootstrap:any;

@Component({
  selector: 'app-ad-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './ad-details.component.html',
  styleUrl: './ad-details.component.css'
})
export class AdDetailsComponent implements OnInit{
  adId: string = '';
  ad: any;

  bookingData = {
    userId: '',
    adId: '',
    startDate: '',
    endDate: '',
    message: '',
    totalPrice: 0
  };
  

  constructor(private route: ActivatedRoute, private adService: AdService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id')!;
    this.fetchAdDetails();
  }
  

  fetchAdDetails(): void {
    this.adService.fetchAdDetails(this.adId).subscribe({
      next: (res: any) => this.ad = res,
      error: err => console.error('Failed to fetch ad:', err)
    });
  }
  
  submitBooking() {
    this.bookingData.adId = this.ad._id;
    this.bookingData.userId = localStorage.getItem("userId") || '';
  
    this.bookingService.createBooking(this.bookingData).subscribe({
      next: (res) => {
        console.log('Booking successful:', res);
        alert('Booking submitted successfully!');

        const modalElement = document.getElementById('bookingModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
  
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Booking failed, try again.');
      }
    });
  }  
}
