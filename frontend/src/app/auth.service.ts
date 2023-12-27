import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private WebReqService:WebRequestService,private router:Router,private http:HttpClient) {}

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
  signup(email:string,password:string){
    return this.WebReqService.signup(email,password).pipe(
      shareReplay(),
      tap((res:HttpResponse<any>)=>{
        // The auth token is in the head of this response 
        this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'));
        console.log('Signed Up');
      })
    )
  }

  logout(){
    this.removeSession();

    this.router.navigateByUrl('/login');
  }

  private setSession(userId:string,accessToken:any,refreshToken:any){
    localStorage.setItem('user-id',userId);
    localStorage.setItem('x-access-token',accessToken);
    localStorage.setItem('x-refresh-token',refreshToken);
  }

  private removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken:any){
    return localStorage.setItem('x-access-token',accessToken);
  }

  getRefreshToken():any{
    return localStorage.getItem('x-refresh-token');
  }

  getUserId():any{
    return localStorage.getItem('user-id');
  }

  getNewAccessToken(){
    return this.http.get(`${this.WebReqService.Root_Url}/users/me/access-token`,{
      headers:{
        'x-refresh-token':this.getRefreshToken(),
        '_id':this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }
}

// 'x-refresh-token':this.getRefreshToken(),
//         "_id": 1
