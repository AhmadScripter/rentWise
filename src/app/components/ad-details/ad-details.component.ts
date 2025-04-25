import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-details',
  imports: [CommonModule],
  templateUrl: './ad-details.component.html',
  styleUrl: './ad-details.component.css'
})
export class AdDetailsComponent implements OnInit{
  adId: string = '';
  ad: any;

  constructor(private route: ActivatedRoute, private adService: AdService) {}

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

}
