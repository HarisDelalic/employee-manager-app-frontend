import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'src/app/model/user';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-user-show',
  templateUrl: './user-show.component.html',
  styleUrls: ['./user-show.component.css']
})
export class UserShowComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;
  public selectedUser: User;

  @Input() userSelectedEvent: Observable<User>;

  constructor( private authenticationService : AuthenticationService ) { }

  ngOnInit() {
    this.eventsSubscription = this.userSelectedEvent.subscribe((user) => {
      this.selectedUser = user;
      document.getElementById('openUserInfo').click();
    })
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  public getRoleNames() : string[] {
    return this.authenticationService.getRoleNames().map(roleName => roleName.substring(5))
  }
}
