import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const adminGuardGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);
  var role;

  userService.getRoleFromStorage().subscribe((val) => {
    let roleFromToken = authService.getRoleFromToken();
    role = val || roleFromToken;
  });

  if(role == "Admin"){
    return true;
  }
  else{
    messageService.add({severity: 'warn', summary:  'Access Denied', detail: 'You are not authorised to access this page.' });
    router.navigate(['dashboard'])
    return false;
  }
};
