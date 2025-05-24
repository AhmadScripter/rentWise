import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('adminToken');

  if(token){
    return true
  }else{
    window.alert('Access denied. Admin not logged in.');
    window.location.href = '/admin-login';
    return false;
  }
};
