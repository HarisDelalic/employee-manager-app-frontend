import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { NotificationModule } from './notification/notification.module';

import { AppComponent } from './app.component';
import { UserService } from './service/user.service';
import { AuthenticationService } from './service/authentication.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserComponent } from './components/user/user.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    UserComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotificationModule
  ],
  providers: [AuthenticationGuard, UserService, AuthenticationService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }