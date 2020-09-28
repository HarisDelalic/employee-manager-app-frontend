import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  refreshing : boolean = false;
  private subscriptions : Subscription[] = [];

  constructor( 
    private userService : UserService,
    private notificationService : NotificationService ) { }

  ngOnInit() {
  }

  public onResetPassword(email: string) : void {
    this.refreshing = true;
    this.userService.resetpassword(email).subscribe(
      (response : HttpResponse<User>) => {
        this.notificationService.notify(NotificationType.INFO, 'Your request has been sent')
        this.refreshing = false;
      },
      (errorResponse : HttpErrorResponse) => {
        this.notificationService.notifyErrorOrDefault(errorResponse)
        this.refreshing = false;
      }
    )

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
