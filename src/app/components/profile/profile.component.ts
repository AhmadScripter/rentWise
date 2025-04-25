import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  message: string = '';
  error: string = '';
  isLoading: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.profileForm = this.fb.group({
      cnic: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = "User ID is missing. Please log in again.";
      this.isLoading = false;
      return;
    }

    this.authService.getProfile(userId).subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.patchValue(profile);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading profile:", err);
        this.error = "Failed to load profile data.";
        this.isLoading = false;
      }
    });
  }

  completeProfile(): void {
    if (this.profileForm.invalid) {
      this.error = "Please fill all required fields correctly.";
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = "User ID is missing. Please log in again.";
      return;
    }

    const profileData = {
      userId,
      ...this.profileForm.value
    };

    this.authService.updateProfile(profileData).subscribe({
      next: (response) => {
        this.message = "Profile updated successfully!";
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Error updating profile:", err);
        this.error = err.error?.message || "Something went wrong!";
      }
    });
  }
}
