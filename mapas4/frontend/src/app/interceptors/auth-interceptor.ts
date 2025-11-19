import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  console.log('🔍 Interceptor ejecutado para:', req.url);
  console.log('🔑 Token encontrado:', token ? 'Sí ✅' : 'No ❌');
  
  // Si existe el token, clonar la petición y agregar el header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Token agregado al header Authorization');
  } else {
    console.warn('⚠️ No hay token disponible - La petición se enviará sin autenticación');
  }

  // Enviar la petición modificada y manejar errores
  return next(req).pipe(
    catchError((error) => {
      console.error('❌ Error en petición HTTP:', {
        url: req.url,
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error
      });
      
      // Si es 401 (No autorizado), limpiar storage y redirigir al login
      if (error.status === 401) {
        console.error('🚫 Error 401: No autorizado - Redirigiendo al login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/auth/login']);
      }
      
      // Si es 403 (Prohibido)
      if (error.status === 403) {
        console.error('🚫 Error 403: Acceso prohibido');
      }
      
      // Propagar el error para que el componente lo pueda manejar
      return throwError(() => error);
    })
  );
};