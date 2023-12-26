import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private WebReqService:WebRequestService,private router:Router) {}

  login(email:string,password:string){
    return this.WebReqService.login(email,password).pipe(
      shareReplay(),
      tap((res:HttpResponse<any>)=>{
        // The auth token is in the head of this response 
        this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'));
        console.log('LoggedIn');
      })
    )
  }

  logout(){
    this.removeSession();
  }

  private setSession(userId:string,accessToken:any,refreshToken:any){
    localStorage.setItem('user-id',userId);
    localStorage.setItem('access-token',accessToken);
    localStorage.setItem('refresh-token',refreshToken);
  }

  private removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken:string){
    return localStorage.setItem('x-access-token',accessToken);
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }
}
