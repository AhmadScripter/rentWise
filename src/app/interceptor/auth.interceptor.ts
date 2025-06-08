import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userToken = localStorage.getItem('authToken');
    let adminToken = localStorage.getItem('adminToken');

    console.log(userToken);

    let clonedReq = req;

    // Remove expired tokens
    if (adminToken && this.isTokenExpired(adminToken)) {
      localStorage.removeItem('adminToken');
      adminToken = null;
    }

    if (userToken && this.isTokenExpired(userToken)) {
      localStorage.removeItem('authToken');
      userToken = null;
    }

    // Attach valid token
    if (adminToken) {
      clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${adminToken}` }
      });
    } else if (userToken) {
      clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${userToken}` }
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if ([400, 401, 403].includes(error.status)) {
          if (adminToken) {
            localStorage.removeItem('adminToken');
            this.router.navigate(['/admin-login']);
          } else if (userToken) {
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/login']);
          }
        }

        return throwError(() => error);
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return expiry < now;
    } catch (e) {
      return true; // Invalid token = treat as expired
    }
  }
}