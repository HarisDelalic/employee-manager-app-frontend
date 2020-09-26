import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../model/enum/notification-type.enum';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) { }

  public notify(type: NotificationType, message: string) {
    this.notifier.notify(type, message);
  }

  public notifyErrorOrDefault(errorResponse: HttpErrorResponse) {
    errorResponse.error.message ?
              this.notify(NotificationType.ERROR, errorResponse.error.message) :
              this.notify(NotificationType.ERROR, 'An error occurred. Please try again.')
  }
}
