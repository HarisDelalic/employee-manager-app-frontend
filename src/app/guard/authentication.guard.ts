import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotifierService } from 'angular-notifier';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService : AuthenticationService, private router: Router,
    private notificationService: NotificationService) {}

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : 
      Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, 'You need to log in to access this page');
    return false;
  }

}
