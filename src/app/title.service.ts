import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titleSubject = new BehaviorSubject<string>('Users');
  
  constructor() { }

  public titleChangeAction(title: string) : void {
    this.titleSubject.next(title);
  }

  public titleChangeListen() : Observable<string> {
    return this.titleSubject.asObservable();
  }
}
