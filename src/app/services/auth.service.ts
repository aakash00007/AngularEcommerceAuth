import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'http://localhost:5188/api/Authentication/';
  private payload: any;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.payload = this.getPayLoadFromToken();
    // console.log('constructor ', this.payload);
  }

  signUp(userObj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}Register`, userObj);
  }

  login(loginObj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}Login`, loginObj);
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getPayLoadFromToken() {
    const jwtHelper = new JwtHelperService();
    const storedToken = this.getToken()!;
    return jwtHelper.decodeToken(storedToken);
  }

  getNameFromToken() {
    if (this.payload) {
      return this.payload.fullname;
    }
  }

  getRoleFromToken() {
    if (this.payload) {
      return this.payload.role;
    }
  }

  renewToken(tokenApi : TokenApiModel){
    return this.httpClient.post<any>(`${this.baseUrl}Refresh`,tokenApi);
  }
}
