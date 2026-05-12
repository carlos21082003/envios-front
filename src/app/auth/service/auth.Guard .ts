import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service';
import { Roles } from '../../usuarios/models/usuarios';


export const authGuard = (allowedRoles?: Roles[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.estaLogueado()) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userRol = authService.getRol();

      if (!userRol || !allowedRoles.includes(userRol as Roles)) {
        router.navigate(['/dashboard']); 
        return false;
      }
    }

    return true;
  };
};