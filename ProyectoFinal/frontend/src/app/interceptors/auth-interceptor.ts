import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Lista de URLs externas que NO deben llevar token
  const externalUrls = [
    'router.project-osrm.org',
    'nominatim.openstreetmap.org',
    'tile.openstreetmap.org'
  ];
  
  // Verificar si la petición es a un servicio externo
  const isExternalRequest = externalUrls.some(url => req.url.includes(url));
  
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  console.log('=== INTERCEPTOR DEBUG ===');
  console.log('Token existe:', !!token);
  console.log('URL:', req.url);
  console.log('Es externa:', isExternalRequest);
  console.log('Método:', req.method);
  
  // Solo agregar token si NO es externa, NO es /auth/ y el token existe
  if (token && !req.url.includes('/auth/') && !isExternalRequest) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Headers agregados: Authorization Bearer');
    
    return next(clonedRequest).pipe(
      catchError((error) => {
        console.error('=== ERROR EN INTERCEPTOR ===');
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        
        // Si el error es 401 o 403, redirigir al login
        if (error.status === 401 || error.status === 403) {
          console.log('Redirigiendo al login por error de autenticación');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.navigate(['/auth']);
        }
        
        return throwError(() => error);
      })
    );
  }
  
  console.log('Request sin modificar (externa o /auth)');
  return next(req);
};