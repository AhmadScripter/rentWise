import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryName: string = '';
  categoryAds: any[] = [];

  constructor(private route: ActivatedRoute, private adService: AdService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryName = params.get('name') || '';
      this.fetchCategoryAds();
    });
  }
  getTimeAgo(uploadTime: string): string {
    return formatDistanceToNow(new Date(uploadTime), { addSuffix: true });
  }
  fetchCategoryAds(): void {
    this.adService.getAllAds().subscribe((data) => {
      this.categoryAds = data.filter((ad) => ad.category === this.categoryName);
    });
  }
}
