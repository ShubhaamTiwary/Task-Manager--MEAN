import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly Root_Url='http://localhost:3000'

  constructor(private http: HttpClient) { }

  get(uri:string){
    return this.http.get(`${this.Root_Url}/${uri}`);
  }

  post(uri:string,payload:Object){
    return this.http.post(`${this.Root_Url}/${uri}`,payload);
  }

  patch(uri:string,payload:Object){
    return this.http.patch(`${this.Root_Url}/${uri}`,payload);
  }

  delete(uri:string){
    return this.http.delete(`${this.Root_Url}/${uri}`);
  }
  
  login(email:string,password:string){
    return this.http.post(`${this.Root_Url}/users/login`,{
      email,
      password,
    },{observe:'response'});
  }
}
