import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { HeaderType } from 'src/app/model/enum/header-type.enum';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public showLoading : boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
    private notificationService : NotificationService,
    private router: Router) { }

  public onRegister(user: User) : void {
    this.authenticationService.register(user).subscribe(
      (response : HttpResponse<User>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN);
        this.authenticationService.saveUserToLocalStorage(response.body)
        this.authenticationService.saveTokenToLocalStorage(token)
        this.router.navigateByUrl('/users')
        this.notificationService.notify(NotificationType.SUCCESS, 
          `Cestitamo ${user.firstName}! Poslali smo vam password emailom`)
        this.showLoading = false;
      },
      (errorResponse) => {
        this.notificationService.notifyErrorOrDefault(errorResponse);
        this.showLoading = false;
      }
    );
  }

  ngOnInit() {
    if(this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/users');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

}
