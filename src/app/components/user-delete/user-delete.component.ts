import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;
  private subscriptions : Subscription[] = [];
  @Input() private userDeletedEvent : Observable<String>;
  username: String;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.eventsSubscription = this.userDeletedEvent.subscribe((username) => {
      this.username = username;
      console.log('username changed: ', username)
      document.getElementById('openUserDelete').click();
    })
    this.subscriptions.push(this.eventsSubscription);
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public deleteUser() {
    this.subscriptions.push(
      this.userService.delete(this.username).subscribe(
        (response) => {
          this.notificationService.notify(NotificationType.SUCCESS, 'User successfully deleted')
          document.getElementById('delete-user-close').click()
        },
        (errorResponse : HttpErrorResponse) => {
          this.notificationService.notifyErrorOrDefault(errorResponse);
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
