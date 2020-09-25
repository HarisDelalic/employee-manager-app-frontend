import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';

import { User } from '../model/user'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host: string = environment.backendApiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: User) : Observable<HttpResponse<any> | HttpErrorResponse>  {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/login`, user, {observe: 'response'});
  }

  public registration(user: User) : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/registration`, user);
  } 

  public logout() : void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  private saveToken(token: string) : void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public getToken() : string {
    return localStorage.getItem('token');
  }

  private loadToken() : void {
    this.token = localStorage.getItem('token');
  }

  private addUserToLocalCache(user: User) : void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromLocalCache() : User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== ''){
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }
  }
}
