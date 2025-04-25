import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { AdService } from '../../services/ad.service';
import { formatDistanceToNow } from 'date-fns';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Category {
  name: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchQuery: string = '';

  electronicAds: any[] = [];
  furnitureAds: any[] = [];
  vehicleAds: any[] = [];
  realEstateAds: any[] = [];
  toolAds: any[] = [];
  mobileAds: any[] = [];
  homeApplianceAds: any[] = [];
  bikeAds: any[] = [];

  constructor(private adService: AdService) { }
  ngOnInit(): void {
    this.fetchAds();
  }
  getTimeAgo(uploadTime: string): string {
    return formatDistanceToNow(new Date(uploadTime), { addSuffix: true });
  }
  fetchAds(): void {
    this.adService.getAllAds().subscribe({
      next: (data) => {
        this.electronicAds = data.filter(ad => ad.category === 'Electronics').slice(0, 4);
        this.furnitureAds = data.filter(ad => ad.category === 'Furniture').slice(0, 4);
        this.vehicleAds = data.filter(category => category.category === 'Vehicles').slice(0, 4);
        this.realEstateAds = data.filter(ad => ad.category === 'Property').slice(0, 4);
        this.toolAds = data.filter(ad => ad.category === 'Tools').slice(0, 4);
        this.mobileAds = data.filter(ad => ad.category === 'Mobiles').slice(0, 4);
        this.homeApplianceAds = data.filter(ad => ad.category === 'Home Appliances').slice(0, 4);
        this.bikeAds = data.filter(ad => ad.category === 'Bikes').slice(0, 4);
      },
      error: (err) => console.error("Error fetching ads:", err),
    });
  }

  get filteredAds() {
    if (!this.searchQuery) {
      return [...this.electronicAds, ...this.furnitureAds, ...this.vehicleAds, ...this.realEstateAds, ...this.toolAds, ...this.mobileAds, ...this.homeApplianceAds, ...this.bikeAds];
    }
  
    const query = this.searchQuery.toLowerCase();
    return [...this.electronicAds, ...this.furnitureAds, ...this.vehicleAds, ...this.realEstateAds, ...this.toolAds, ...this.mobileAds, ...this.homeApplianceAds, ...this.bikeAds]
      .filter(ad => ad.title.toLowerCase().includes(query) || ad.category.toLowerCase().includes(query));
  }
  
  categories: Category[] = [
    { name: 'Electronics', image: 'assets/categories/electronics.png' },
    { name: 'Furniture', image: 'assets/categories/furniture.png' },
    { name: 'Vehicles', image: 'assets/categories/vehicles.png' },
    { name: 'Property', image: 'assets/categories/property.png' },
    { name: 'Tools', image: 'assets/categories/tools.png' },
    { name: 'Mobiles', image: 'assets/categories/mobile.png' },
    { name: 'Home Appliances', image: 'assets/categories/appliances.png' },
    { name: 'Bikes', image: 'assets/categories/bike.png' },
  ];

}
