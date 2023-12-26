import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request=this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error);
        return throwError(error);
      })
    );
  }

  addAuthHeader(request: HttpRequest<any>){
    // get the accessToken and append in the request
    const token=this.authService.getAccessToken();

    if(token){
      return request.clone({
        setHeaders:{
          'x-access-token':token
        }
      })
    }

    return request;
  }
}
