import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/user';
import { Role } from 'src/app/model/role';
import { Authority } from 'src/app/model/authority';
import { UserService } from 'src/app/service/user.service';
import { RoleName } from 'src/app/model/enum/role-name.enum';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public user: User;
  public allRoles: RoleName[];
  // TODO could be entity instead of any to be more TS compliant
  public userRoles: any[] = [];
  public userAuthorities: string[] = [];
  public selectedUserUsername: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService : NotificationService) { }

  ngOnInit() {
    this.user = this.authenticationService.getUserFromLocalStorage();
    this.selectedUserUsername = this.user.username;
    this.allRoles = this.userService.getAllRoles();
    this.setUserRoles();
    this.userAuthorities = this.getAuthorities();
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public setRole(event : any,role: any) {
    if (event.target.checked) {
      this.userRoles.forEach(userRole => {
        if (role.name == userRole.name) {
          userRole.isChecked = true;
        }
      })
    } else {
      this.userRoles.forEach(userRole => {
        if (role.name == userRole.name) {
          userRole.isChecked = false;
        }
      })
    }
  }

  public getAuthorities() : string[] {
    let authorities : Authority[] = [];

    this.user.roles.forEach(role => {
      authorities = authorities.concat(role.authorities);
    });

    return authorities.map(authority => authority.name);
  }

  public onUpdateCurrentUser(profileUserForm : NgForm) {
    this.user.roles = [];
    this.userRoles.forEach(userRole => {
      if (userRole.isChecked) {
        this.user.roles.push(userRole.name)
      }
    })

    const updatedUser : User = this.userService.createOrUpdateUser(profileUserForm, this.user.roles);
    console.log('updatedUser: ', updatedUser)
    const formData : FormData = this.userService.createUserFormData(this.selectedUserUsername, updatedUser, null);
    
    this.subscriptions.push(
      this.userService.update(formData).subscribe(
       (response : User) => {
         // since we are updating roles
         this.authenticationService.saveUserToLocalStorage(response)
         this.user = this.authenticationService.getUserFromLocalStorage()
         this.userAuthorities = this.getAuthorities()
         this.notificationService.notify(NotificationType.SUCCESS, 'User updated successfully')
         document.getElementById('edit-user-close').click()
       },
       (errorResponse : HttpErrorResponse) => {
         this.notificationService.notifyErrorOrDefault(errorResponse)
       } 
      )
    )
  }

 /* public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
  } */


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  // create array of objects, for each role check if user has it 
  // (set isChecked = true), or not have it (set isChecked to false)
  private setUserRoles() {
    this.allRoles.forEach(roleName => {
      if (this.user.roles.map(role => role.name).includes(roleName)) {
        this.userRoles.push({name: roleName, isChecked: true})
      } else {
        this.userRoles.push({name: roleName, isChecked: false})
      }
    }); 
  }

}
