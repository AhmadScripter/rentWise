import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp > now) {
      return true;
    }
    localStorage.removeItem('adminToken');
  }

  window.alert('Access denied. Admin not logged in.');
  window.location.href = '/admin-login';
  return false;
};