import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, empty, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) { }

  refreshingAccessToken:Boolean=false;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request=this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error);
        if(error.status==401 && !this.refreshingAccessToken){
          // 401 error - We are unauthorized
          // also refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(()=>{
              request=this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err:any)=>{
              // console.log(err);
              this.authService.logout();
              return empty();
            })
          )
        }
        return throwError(error);
      })
    );
  }

  refreshAccessToken(){
    this.refreshingAccessToken=true;
    return this.authService.getNewAccessToken().pipe(
      tap(()=>{
        this.refreshingAccessToken=false;
        console.log('Access Token Refreshed');
      })
    )
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
