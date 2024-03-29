import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from '../model/nav-item';
import { NavService } from '../service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('indicatorRotate', [
        state('collapsed', style({ transform: 'rotate(0deg)' })),
        state('expanded', style({ transform: 'rotate(180deg)' })),
        transition('expanded <=> collapsed',
            animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
        ),
    ])
]
})
export class SidebarComponent implements OnInit {

  expanded: boolean = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item!: NavItem;
  @Input() depth!:number;

  constructor(public navService: NavService,
      public router: Router) {
      if (this.depth ===undefined) {
          this.depth = 0;
      }
  }

  ngOnInit() {
      this.navService.currentUrl.subscribe((url: string) => {
          if (this.item.route && url) {
              this.expanded = url.indexOf(`/${this.item.route}`) === 0;
              this.ariaExpanded = this.expanded;
          }
      });
  }

  onItemSelected(item: NavItem) {
      if (!item.children || !item.children.length) {
          this.router.navigate([item.route]);
      }

      if (item.children && item.children.length) {
          this.expanded = !this.expanded;
      }
  }

}
