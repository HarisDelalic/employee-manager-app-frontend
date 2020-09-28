import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { User } from 'src/app/model/user';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { HeaderType } from 'src/app/model/enum/header-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  public subscriptions: Subscription[] = [];

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    if(this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/users');
    }
  }

  public onLogin(user: User) : void {
    console.log(user);
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveTokenToLocalStorage(token);
          this.authenticationService.saveUserToLocalStorage(response.body);
          this.router.navigateByUrl('/users');
          this.showLoading = false;
        }, (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notificationService.notifyErrorOrDefault(errorResponse);
          this.showLoading = false;
        }
      )
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
