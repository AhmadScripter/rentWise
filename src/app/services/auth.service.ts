import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkToken());
  isLoggedIn = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Check if token exists
  private checkToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get token
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  // Remove token and userId on logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.setLoginStatus(false);
  }

  // Update login status observable
  setLoginStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  // Optional init call (e.g. on app start)
  initializeAuth(): void {
    this.setLoginStatus(this.checkToken());
  }

  //get all users
  getAllUsers() {
    const token = localStorage.getItem('adminToken');
    return this.http.get(`${this.baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  // Register - sends OTP to email
  register(name: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/registeration`, { name, email, password, confirmPassword });
  }

  // Verify Email OTP and save user
  verifyEmailOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-email`, { email, otp });
  }

  // Login and save token + userId
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string, userId: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
          localStorage.setItem('userId', response.userId);
          this.setLoginStatus(true);
        }
      })
    );
  }

  // Complete or update user profile
  updateProfile(profileData: { userId: string; cnic: string; gender: string; address: string; postalCode: string; phone: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/${profileData.userId}`, profileData, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  // Get user profile by ID
  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  completeProfile(profileData: { userId: string; cnic: string; gender: string; address: string; postalCode: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/${profileData.userId}`, profileData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  // Block user by ID
  blockUser(userId: string): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/block/${userId}`, {}, { headers });
  }

  // Unblock user by ID
  unblockUser(userId: string): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/unblock/${userId}`, {}, { headers });
  }

}
