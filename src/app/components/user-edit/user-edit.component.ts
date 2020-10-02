import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { RoleName } from 'src/app/model/enum/role-name.enum';
import { Authority } from 'src/app/model/authority';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;
  private subscriptions : Subscription[] = [];
  public selectedUser = new User;
  public selectedUserUsername : string;
  public allRoles: RoleName[];
  public userRoles: any[];

  @Input() userEditedEvent: Observable<User>;
  profileImageName: string;
  profileImage: File;

  constructor(
    private authenticationService : AuthenticationService,
    private userService : UserService,
    private notificationService : NotificationService) { }

  ngOnInit() {
    this.eventsSubscription = this.userEditedEvent.subscribe((user) => {
      this.selectedUser = user;
      this.selectedUserUsername = user.username;
      this.allRoles = this.userService.getAllRoles();
      this.setUserRoles();
      document.getElementById('openUserEdit').click();
    })
    this.subscriptions.push(this.eventsSubscription);
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public onProfileImageChange(fileList : FileList) : void {
    this.profileImageName = fileList[0].name;
    this.profileImage = fileList[0];
  }

  public editUser() {
    document.getElementById('edit-user-save').click()
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

  onEditUser(editUserForm: NgForm) {
    this.selectedUser.roles = [];
    this.userRoles.forEach(userRole => {
      if (userRole.isChecked) {
        this.selectedUser.roles.push({name: userRole.name, authorities: []})
      }
    })
 
    const updatedUser : User = this.userService.createOrUpdateUser(editUserForm, this.selectedUser.roles);
    const formData : FormData = this.userService.createUserFormData(this.selectedUserUsername, updatedUser, this.profileImage);
    
    this.subscriptions.push(
      this.userService.update(formData).subscribe(
       (response : User) => {
         this.setUserRoles()
         this.notificationService.notify(NotificationType.SUCCESS, 'User updated successfully')
         document.getElementById('edit-user-close').click()
       },
       (errorResponse : HttpErrorResponse) => {
         this.notificationService.notifyErrorOrDefault(errorResponse)
       } 
      )
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private setUserRoles() {
    this.userRoles = [];
    this.allRoles.forEach(roleName => {
      if (this.selectedUser.roles.map(role => role.name).includes(roleName)) {
        this.userRoles.push({name: roleName, isChecked: true})
      } else {
        this.userRoles.push({name: roleName, isChecked: false})
      }
    }); 
  }

}
