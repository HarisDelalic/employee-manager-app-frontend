import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

import { User } from '../model/user';
import { NgForm } from '@angular/forms';
import { RoleName } from '../model/enum/role-name.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host: string = environment.backendApiUrl;

  constructor(private http: HttpClient) { }

  public findAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/users/all`)
  }

  public findByUsernameOrEmailOrLastNameOrFirstName(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/users/find`, { params: { searchTerm } })
  }

  public findById(id: number): Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.get<HttpResponse<any> | HttpErrorResponse>
      (`${this.host}/users/${id}`)
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>
      (`${this.host}/users/add`, formData)
  }

  public update(formData: FormData): Observable<User> {
    return this.http.put<User>
      (`${this.host}/users/update`, formData)
  }

  public resetpassword(email: String):
    Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.put<HttpResponse<any> | HttpErrorResponse>
      (`${this.host}/users/resetpassword`, email)
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  public delete(username: String): Observable<void | HttpErrorResponse> {
    return this.http.delete<void>
      (`${this.host}/users/delete/${username}`)
  }

  public getProfileImage(username: string, filename: string): Observable<HttpResponse<any> | HttpErrorResponse> {
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
    if (loggedInUsername) {
      formData.append('username', loggedInUsername);
    }

    formData.append('user', JSON.stringify(user));
    formData.append('profileImage', profileImage);
    return formData;
  }

  public createOrUpdateUser(userForm: NgForm, userRoles: any[]): User {
    const formValue: any = userForm.form.value;

    const user: User = new User();
    user.firstName = formValue.firstName;
    user.username = formValue.username;
    user.lastName = formValue.lastName;
    user.email = formValue.email;
    user.active = formValue.active ? JSON.parse(formValue.active) : false;
    user.locked = formValue.locked ? JSON.parse(formValue.locked) : false;
    user.roles = userRoles;
    return user;
  }

  public getAllRoles(): RoleName[] {
    const allRoles =
      [
        RoleName.ROLE_USER,
        RoleName.ROLE_HR,
        RoleName.ROLE_MANAGER,
        RoleName.ROLE_ADMIN,
        RoleName.ROLE_SUPERUSER,
      ]
    return allRoles;
  }
}
