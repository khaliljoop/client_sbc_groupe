import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
//import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter, Subscription } from 'rxjs';
import { menu } from './model/menu';
import { NavItem } from './model/nav-item';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  public opened: boolean = true;
    private mediaWatcher!: Subscription;
    public menu: NavItem[] = menu;

    constructor(private media: MediaObserver,private observer: BreakpointObserver, private router: Router) {
        /*this.mediaWatcher = this.media.media$.subscribe((mediaChange: MediaChange) => {
            this.handleMediaChange(mediaChange);
        })*/
    }
    ngOnInit(): void {
     // this.base_url=environment.localUrl;
      this.handleMediaChange();
    }

    private handleMediaChange() {
        if (this.media.isActive('lt-md')) {
            this.opened = false;
        } else {
            this.opened = true;
        }
    }

    ngOnDestroy() {
        this.mediaWatcher.unsubscribe();
    }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res:any) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e:any) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
}
