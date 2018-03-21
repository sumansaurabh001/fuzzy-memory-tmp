import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenavContent} from '@angular/material';
import {NavigationEnd, Router} from '@angular/router';
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router:Router) {

  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => this.scrollToTop())
      )
      .subscribe();
  }

  scrollToTop() {

    const main = document.querySelector('mat-sidenav-content');

    if (main) {
      main.scrollTo(0,0);
    }
  }


}
