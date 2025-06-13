import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authEndpoints = ['/login', '/admin-login', '/register', '/verify-email'];
  if (authEndpoints.some(url => req.url.includes(url))) {
    return next(req);
  }

  console.log('Intercepting request:', req.url);

  let userToken = localStorage.getItem('authToken');
  let adminToken = localStorage.getItem('adminToken');

  const now = Math.floor(Date.now() / 1000);

  const isExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < now;
    } catch {
      return true;
    }
  };

  if (adminToken && isExpired(adminToken)) {
    console.warn('Admin token expired, redirecting...');
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
    return EMPTY;
  }

  if (userToken && isExpired(userToken)) {
    console.warn('User token expired, redirecting...');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return EMPTY;
  }

  let cloned = req;
  if (adminToken) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${adminToken}` } });
  } else if (userToken) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${userToken}` } });
  }

  return next(cloned);
};