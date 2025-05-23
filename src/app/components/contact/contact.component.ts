import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit{
  contactForm!: FormGroup;
  successMsg = '';
  errorMsg = '';
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.errorMsg = 'Please fill all required fields correctly.';
      this.successMsg = '';
      setTimeout(() => this.errorMsg = '', 4000);
      return;
    }

    this.isSubmitting = true; 

    if (this.contactForm.valid) {
      this.http.post('http://localhost:3000/api/contact', this.contactForm.value).subscribe({
        next: (res: any) => {
          this.successMsg = res.message;
          this.errorMsg = '';
          this.contactForm.reset();
          this.isSubmitting = false;

          setTimeout(() => {
            this.successMsg = '';
            this.errorMsg = '';
          }, 4000);
        },
        error: (err) => {
          console.error('Error response:', err);
          this.errorMsg = err.error?.error || 'Something went wrong';
          this.successMsg = '';
          this.isSubmitting = false;

          setTimeout(() => {
            this.successMsg = '';
            this.errorMsg = '';
          }, 4000);
        }
      });
    } else {
      console.log('Form is incomplete');

      this.errorMsg = 'Please fill all required fields correctly.';
      this.successMsg = '';

      setTimeout(() => {
        this.errorMsg = '';
      }, 4000);
    }
  }
}
