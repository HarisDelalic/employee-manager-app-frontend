import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host: string = environment.backendApiUrl;

  constructor(private http: HttpClient) { }

  public findAll() : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.get<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users`)
  }

  public findById(id: number) : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.get<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users${id}`)
  }

  public addUser(formData : FormData) : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/add`, formData)
  }

  public update(formData : FormData) : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.put<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/update`, formData)
  }

  public resetpassword(email: String) : 
  Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.put<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/resetpassword`, email)
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public delete(id: number) : Observable<any | HttpErrorResponse> {
    return this.http.delete<any | HttpErrorResponse>
    (`${this.host}/users/delete/${id}`)
  }

  public getProfileImage(username: string, filename: string) : Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.get<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/users/image/${username}/${filename}`)
  }

  public addUsersToLocalStorage(users: User[]): void {
    localStorage.setItem('user', JSON.stringify(users));
  }

  public getUsersToLocalStorage(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('user'));
    }
  }

  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('username', loggedInUsername);
    formData.append('user', JSON.stringify(user));
    formData.append('profileImage', profileImage);
    return formData;
  }
}
