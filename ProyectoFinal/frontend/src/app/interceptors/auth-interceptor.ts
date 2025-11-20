import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  console.log('=== INTERCEPTOR DEBUG ===');
  console.log('Token existe:', !!token);
  console.log('Token primeros 20 chars:', token ? token.substring(0, 20) + '...' : 'N/A');
  console.log('URL:', req.url);
  console.log('Método:', req.method);
  
  // Si existe el token y no es una petición de autenticación, agregar el header
  if (token && !req.url.includes('/auth/')) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Headers agregados:', {
      Authorization: clonedRequest.headers.get('Authorization')?.substring(0, 30) + '...',
      ContentType: clonedRequest.headers.get('Content-Type')
    });
    
    return next(clonedRequest).pipe(
      catchError((error) => {
        console.error('=== ERROR EN INTERCEPTOR ===');
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error completo:', error);
        
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
  
  console.log('Request sin token (probablemente /auth)');
  return next(req);
};