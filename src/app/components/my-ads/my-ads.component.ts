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
export class MyAdsComponent implements OnInit {
  ads: any[] = [];
  isExpanded: { [key: string]: boolean } = {};
  adForm: FormGroup;
  categories = ["Electronics", "Tools", "Furniture", "Vehicles", "Property", "Mobiles", "Home Appliances", "Bikes"];
  userId: string | null = localStorage.getItem("userId");
  selectedFile: File | null = null;
  successMsg = '';
  errorMsg = '';
  isSubmitting = false;
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

  toggleDescription(adId: string) {
    this.isExpanded[adId] = !this.isExpanded[adId]
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
      this.errorMsg = "User ID not found. Please login again.";
      setTimeout(() => this.errorMsg = '', 4000);
      return;
    }

    if (this.adForm.invalid) {
      this.errorMsg = "Please fill all required fields correctly.";
      setTimeout(() => this.errorMsg = '', 4000);
      return;
    }

    this.isSubmitting = true;

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
        this.successMsg = res.message || "Ad created successfully!";
        setTimeout(() => { this.successMsg = '' }, 4000);
        this.errorMsg = '';
        this.fetchAds();
        this.adForm.reset();
        this.selectedFile = null;
        this.isSubmitting = false;

      },
      error: (err) => {
        console.error("Error creating ad:", err);
        this.errorMsg = "Failed to create ad. Please check whether you have completed your profile or not :)";
        this.successMsg = '';
        this.isSubmitting = false;

        setTimeout(() => {
          this.errorMsg = '';
        }, 5000);
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