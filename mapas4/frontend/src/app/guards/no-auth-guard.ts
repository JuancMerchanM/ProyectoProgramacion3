import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);
  const token = localStorage.getItem('token');
  
  console.log('🛡️ Auth Guard ejecutado');
  console.log('🔑 Token presente:', token ? 'Sí ✅' : 'No ❌');
  console.log('📍 Intentando acceder a:', state.url);
  
  if (token) {
    // Hay token, permitir acceso
    console.log('✅ Acceso permitido');
    return true;
  } else {
    // No hay token, redirigir al login
    console.log('🚫 Acceso denegado - Redirigiendo al login');
    router.navigate(['/auth/login']);
    return false;
  }
};
