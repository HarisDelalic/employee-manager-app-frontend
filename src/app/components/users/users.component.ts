import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Subscription, Subject } from 'rxjs';
import { User } from 'src/app/model/user';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  userSelectedEvent: Subject<User> = new Subject<User>();

  showLoading: boolean = false;
  public title: string = '';
  public users: User[];
  private subscriptions: Subscription[] = [];


  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.showLoading = true;
    this.getUsers(true);
  }

  public getUsers(nesto: boolean): void {
    this.subscriptions.push(
      this.userService.findAll().subscribe(
        (httpResponse: User[]) => {
          this.users = httpResponse
          this.notificationService.notify(NotificationType.SUCCESS, 'Successfully retreived users')
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notifyErrorOrDefault(errorResponse)
        }
      )
    )
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public searchUsers(searchTerm: string) {
    this.subscriptions.push(
      this.userService.findByUsernameOrEmailOrLastNameOrFirstName(searchTerm).subscribe(
        (httpResponse: User[]) => {
          this.users = httpResponse
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notifyErrorOrDefault(errorResponse)
        }
      )
    )
  }

  public onSelectUser(user: User): void {
    this.userSelectedEvent.next(user);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
