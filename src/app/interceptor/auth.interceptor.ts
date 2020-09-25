import { HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public authenticationService: AuthenticationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<import("@angular/common/http")
    .HttpEvent<any>> {
        if (
            !req.url.includes(`${this.authenticationService.host}/users/login`) &&
            !req.url.includes(`${this.authenticationService.host}/users/register`) &&
            !req.url.includes(`${this.authenticationService.host}/users/resetpassword`)) {
                const authRequest = req
                    .clone({ setHeaders: { Authorization: 'Bearer ' + this.authenticationService.getToken() } });
                return next.handle(authRequest);
        } else {
            return next.handle(req);
        }
    }
}