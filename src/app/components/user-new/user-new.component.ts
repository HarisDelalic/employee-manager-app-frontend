import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit, OnDestroy {
  private subscriptions : Subscription[] = [];

  public profileImageName: string;
  public profileImage: File;

  constructor( 
    private authenticationService : AuthenticationService ,
    private userService : UserService,
    private notificationService : NotificationService ) { }

  ngOnInit() {

  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public saveNewUser() : void {
    document.getElementById('new-user-save').click();
  }

  public onProfileImageChange(fileList : FileList) : void {
    this.profileImageName = fileList[0].name;
    this.profileImage = fileList[0];
  }

  public onAddNewUser(newUserForm: NgForm) {
    const newUser : User = this.userService.createNewUser(newUserForm);
    const formData : FormData = this.userService.createUserFormData(null, newUser, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
          (response: User) => {
            this.notificationService.notify(NotificationType.SUCCESS, 
              "Congratulations, you have added new user " + response.username)
              document.getElementById('new-user-close').click()
          }, (errorResponse: HttpErrorResponse) => {
            this.notificationService.notify(NotificationType.ERROR, 
              "Something went worng")
          }
        )
      )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
