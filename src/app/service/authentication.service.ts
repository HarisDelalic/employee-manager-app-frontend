import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';

import { User } from '../model/user'
import { Role } from '../model/role';
import { RoleName } from '../model/enum/role-name.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host: string = environment.backendApiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/users/login`, user, { observe: 'response' });
  }

  public register(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>
      (`${this.host}/users/registration`, user, { observe: 'response' });
  }

  public logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveTokenToLocalStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  private loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public saveUserToLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
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

  public getRoleNames(): string[] {
    const user: User = this.getUserFromLocalStorage();
    return user ? user.roles.map(role => role.name) : [];
  }

  public isAdmin(): boolean {
    const isAdmin: boolean = this.getRoleNames().filter(roleName =>
      ((RoleName.ROLE_ADMIN) === roleName
        || RoleName.ROLE_SUPERUSER === roleName)).length > 0

    console.log(isAdmin)
    return isAdmin;
  }
}
