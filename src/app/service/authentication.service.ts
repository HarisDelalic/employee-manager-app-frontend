import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { User } from '../model/user'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private host: string = environment.backendApiUrl;

  constructor(private http: HttpClient) { }

  public login(user: User) : Observable<HttpResponse<any> | HttpErrorResponse>  {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/login`, user, {observe: 'response'});
  }

  public registration(user: User) : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/registration`, user);
  } 
}
