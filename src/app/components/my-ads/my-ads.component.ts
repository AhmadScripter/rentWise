import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { formatDistanceToNow } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-ads',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-ads.component.html',
  styleUrl: './my-ads.component.css'
})
export class MyAdsComponent implements OnInit{
  ads: any[] = [];
  adForm: FormGroup;
  categories = ["Electronics", "Tools", "Furniture", "Vehicles", "Property", "Mobiles", "Home Appliances", "Bikes"];
  userId: string | null = localStorage.getItem("userId");
  selectedFile: File | null = null;
  errorMsg = '';
  loading = false;

  constructor(private adService: AdService, private fb: FormBuilder, private router: Router) {
    this.adForm = this.fb.group({
      title: ["", Validators.required],
      category: ["", Validators.required],
      description: ["", Validators.required],
      location: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(1)]],
      img: [null],
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem("userId")) {
      this.router.navigate(['/login']);
    }
  
    this.fetchAds();
  }


  getTimeAgo(uploadTime: string): string {
    return formatDistanceToNow(new Date(uploadTime), { addSuffix: true });
  }

  fetchAds(): void {
    this.loading = true;
    this.adService.getUserAds(this.userId!).subscribe({
      next: (data) => {
        this.ads = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error fetching your ads.';
        console.error("Error fetching ads:", err);
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  createAd(): void {
    if (!this.userId) {
      console.error("User ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append("title", this.adForm.value.title);
    formData.append("category", this.adForm.value.category);
    formData.append("description", this.adForm.value.description);
    formData.append("price", this.adForm.value.price);
    formData.append("location", this.adForm.value.location);
    formData.append("userId", this.userId);

    if (this.selectedFile) {
      formData.append("img", this.selectedFile);
    }

    this.adService.createAd(formData).subscribe({
      next: (res) => {
        console.log("Ad created:", res);
        this.fetchAds();
        this.adForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error("Error creating ad:", err);
        this.errorMsg = "Failed to create ad. Please check whether you have completed your profile or not :)";
        alert(this.errorMsg)
      }
    });
  }

  deleteAd(adId: string): void {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    this.adService.deleteAd(adId).subscribe({
      next: () => {
        this.ads = this.ads.filter((ad) => ad._id !== adId);
      },
      error: (err) => {
        console.error("Error deleting ad:", err);
      }
    });
  }
}