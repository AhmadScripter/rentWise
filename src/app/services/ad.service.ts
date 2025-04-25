import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private apiUrl = 'http://localhost:3000/api/ads';

  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserAds(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  createAd(adData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, adData, { headers: this.getHeaders() });
  }

  deleteAd(adId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${adId}`, { headers: this.getHeaders() });
  }

  getAllAds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  fetchAdDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}
