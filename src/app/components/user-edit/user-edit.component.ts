import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

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

  @Input() userEditedEvent: Observable<User>;
  profileImageName: string;
  profileImage: File;

  constructor(
    private authenticationService : AuthenticationService,
    private userService : UserService,
    private notificationService : NotificationService) { }

  ngOnInit() {
    this.eventsSubscription = this.userEditedEvent.subscribe((user) => {
      console.log('in open user edit')
      this.selectedUser = user;
      this.selectedUserUsername = user.username;
      document.getElementById('openUserEdit').click();
    })
    // this.subscriptions.push(this.eventsSubscription);
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

  onEditUser(editUserForm: NgForm) {
    console.log(editUserForm)
    // TODO: this has to be changed,
    // since we are using only one role in frontend (using select), 
    // and in backend we it is required to be set of roles (user should have multiple roles),
    // we are not using [(ngModel)] on form fileds
    const updatedUser : User = this.userService.createOrUpdateUser(editUserForm);
    const formData : FormData = this.userService.createUserFormData(this.selectedUserUsername, updatedUser, this.profileImage);
    
    this.subscriptions.push(
      this.userService.update(formData).subscribe(
       (response : any) => {
         console.log('respoinse')
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
    this.eventsSubscription.unsubscribe()
  }

}
