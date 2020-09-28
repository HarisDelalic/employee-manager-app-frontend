import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TitleService } from 'src/app/title.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  
  public titleAction$ : Observable<string>;
  
  constructor( private titleService: TitleService ) { }

  ngOnInit() {
    this.titleAction$ = this.titleService.titleChangeListen();
  }
}
