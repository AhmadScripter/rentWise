import { Component, OnInit } from '@angular/core';
import { AdService } from '../../../services/ad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-ads',
  imports: [CommonModule],
  templateUrl: './all-ads.component.html',
  styleUrl: './all-ads.component.css'
})
export class AllAdsComponent implements OnInit {

  ads: any[] = [];
  errorMsg: string = '';

  constructor(private adService: AdService) { }

  ngOnInit() {
    this.adService.getAllAds().subscribe({
      next: (res: any) => {
        this.ads = res.sort((a: any, b: any) =>
          new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
        );
      },
      error: (err) => {
        this.errorMsg = err.error.message || 'Failed to load ads';
      }
    });
  }

  // removeAd(id: string) {
  //   const confirmed = confirm('Are you sure you want to remove this Ad?');
  //   if (!confirmed) return;

  //   this.adService.deleteAd(id).subscribe({
  //     next: () => {
  //       this.ads = this.ads.filter(ad => ad._id !== id);
  //     },
  //     error: (err) => {
  //       console.error('Failed to delete ad:', err);
  //     }
  //   });
  // }  

}
