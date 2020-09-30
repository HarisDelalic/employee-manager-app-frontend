import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { TitleService } from 'src/app/title.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedInUser: User;

  constructor( 
    private authenticationService : AuthenticationService,
    private titleService: TitleService ) { }

  changeTitle(title: string) {
    this.titleService.titleChangeAction(title);
  }

  ngOnInit() {
    this.loggedInUser = this.authenticationService.getUserFromLocalStorage();
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

}
