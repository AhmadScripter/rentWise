import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {
  otpForm: FormGroup;
  email: string = '';
  message: string = '';
  error: string = '';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.otpForm = this.fb.group({
      otp0: ['', [Validators.required]],
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
      otp4: ['', [Validators.required]],
      otp5: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  handleInput(event: any, index: number) {
    const input = event.target;
    
    if (input.value.length > 1) {
      input.value = input.value.charAt(0);
    }
  
    this.otpForm.controls['otp' + index].setValue(input.value, { emitEvent: true });
    this.otpForm.controls['otp' + index].markAsTouched();
    this.otpForm.controls['otp' + index].updateValueAndValidity();
  
    if (input.value && this.otpInputs.get(index + 1)) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
  }
  
  verifyOtp() {
    console.log("🔹 Verify button clicked");
  
    if (this.otpForm.invalid) {
      console.log("🔸 Form is invalid:", this.otpForm.errors);
      this.error = "Please enter a valid 6-digit OTP.";
      return;
    }
  
    const otp = Object.values(this.otpForm.value).join('');
    console.log("🔹 Final OTP:", otp);
  
    this.authService.verifyEmailOTP(this.email, otp).subscribe({
      next: (response) => {
        console.log("✅ OTP Verified Successfully:", response);
        if (response.userId) {
          localStorage.setItem("userId", response.userId);
        localStorage.setItem('authToken', response.token); 
        }
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error("❌ OTP Verification Failed:", err);
        this.error = err.error?.message || "Invalid OTP. Please try again.";
      }
    });
  }
}
