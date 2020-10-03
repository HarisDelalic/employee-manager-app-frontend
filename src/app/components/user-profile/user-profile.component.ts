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
import { HttpErrorResponse, HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { FileUploadStatus } from 'src/app/model/file-upload.status';

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
  profileImage: File;
  profileImageName: string;
  public fileUploadStatus = new FileUploadStatus();

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService : NotificationService,
    private router: Router) { }

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

  public onLogOut() : void {
    this.authenticationService.logout()
    this.router.navigateByUrl('/login')
    this.notificationService.notify(NotificationType.SUCCESS, 'You have been successfully logged out')
  }

  public onProfileImageChange(fileList : FileList) : void {
    this.profileImage = fileList[0];
    this.profileImageName = fileList[0].name;
  }

  public updateProfileImage() : void {
    document.getElementById('profile-image-input').click()
  }

  public onUpdateProfileImage() : void {
    const formData = new FormData();
    formData.append('username', this.user.username)
    formData.append('profileImage', this.profileImage)
    this.subscriptions.push(
      this.userService.updateProfileImage(this.user.username, formData).subscribe(
        (event: HttpEvent<any>) => {
          console.log('update successful')
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
          // this.fileStatus.status = 'done';
        }
      )
    );
  }
  private reportUploadProgress(event: HttpEvent<any>) {
    // Ugly, but for now ok
    switch(event.type) {
      // when upload is in progress
      case HttpEventType.UploadProgress:
        this.fileUploadStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileUploadStatus.status = 'progress';
        break;
      // When upload is done
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`
          this.notificationService.notify(NotificationType.SUCCESS, 'Profile image updated successfully')
          this.fileUploadStatus.status = 'done';
          break;
        } else {
          this.notificationService.notify(NotificationType.ERROR, 'Unable to upload profile image, ... Please try again')
          break;
        }
      default: 
    }
  }


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
