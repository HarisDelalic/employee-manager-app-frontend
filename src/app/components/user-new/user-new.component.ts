import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { RoleName } from 'src/app/model/enum/role-name.enum';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public profileImageName: string;
  public profileImage: File;

  public allRoles: RoleName[];
  public userRoles: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.allRoles = this.userService.getAllRoles();
    this.setUserRoles();
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public saveNewUser(): void {
    document.getElementById('new-user-save').click();
  }

  public onProfileImageChange(fileList: FileList): void {
    this.profileImageName = fileList[0].name;
    this.profileImage = fileList[0];
  }

  public setRole(event: any, role: any) {
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

  public onAddNewUser(newUserForm: NgForm) {
    this.userRoles = this.userRoles.filter(userRole => userRole.isChecked)

    const newUser: User = this.userService.createOrUpdateUser(newUserForm, this.userRoles);
    const formData: FormData = this.userService.createUserFormData(null, newUser, this.profileImage);
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

  private setUserRoles() {
    this.userRoles = [];
    this.allRoles.forEach(roleName => {
      this.userRoles.push({ name: roleName, isChecked: false })
    });
  }
}
