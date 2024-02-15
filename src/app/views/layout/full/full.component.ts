import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';

import { navItems } from './vertical/sidebar/sidebar-data';

import { CoreService } from '../../../services/core.service';
import { NavService } from '../../../services/nav.service';

import { MaterialModule } from '../../../material.module';
import { AppSettings } from '../../../app.config';

import { VerticalSidebarComponent } from './vertical/sidebar/sidebar.component';
import { VerticalNavItemComponent } from './vertical/sidebar/nav-item/nav-item.component';
import { VerticalHeaderComponent } from './vertical/header/header.component';
import { HorizontalHeaderComponent } from './horizontal/header/header.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { CustomizerComponent } from './shared/customizer/customizer.component';
import { HorizontalSidebarComponent } from './horizontal/sidebar/sidebar.component';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

// for mobile app sidebar
interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  standalone: true,
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule,
    NgScrollbarModule,
    VerticalSidebarComponent,
    VerticalNavItemComponent,
    VerticalHeaderComponent,
    HorizontalHeaderComponent,
    HorizontalSidebarComponent,
    BreadcrumbComponent,
    CustomizerComponent,
    TablerIconsModule
  ]
})

export class FullComponent implements OnInit{
  navItems = navItems;

  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  options = this.settings.getOptions();

  private htmlElement!: HTMLHtmlElement;
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  
  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;
  resView = false;

  get isOver(): boolean 
  {
    return this.isMobileScreen;
  }

  get isTablet(): boolean 
  {
    return this.resView;
  }

  ngOnInit(): void {}

  ngOnDestroy() 
  {
    this.layoutChangesSubscription.unsubscribe();
  }

  onSidenavOpenedChange(isOpened: boolean) 
  {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  receiveOptions(options: AppSettings): void 
  {
    this.options = options;
    this.toggleDarkTheme(options);
  }

  toggleDarkTheme(options: AppSettings) 
  {
    if (options.theme === 'dark') 
    {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } 
    else 
    {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }
  }

  toggleCollapsed() 
  {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) 
  {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  constructor
  (
    private settings: CoreService,
    private mediaMatcher: MediaMatcher,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private navService: NavService,
  ){
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => 
      {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        if (this.options.sidenavCollapsed == false) 
        {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });

    // Initialize project theme with options
    this.receiveOptions(this.options);

    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });
  }

  // for mobile app sidebar
  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'eCommerce App',
      subtitle: 'Buy a Product',
      link: '/apps/email/inbox',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-dd-mobile.svg',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      img: '/assets/images/svgs/icon-dd-lifebuoy.svg',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      img: '/assets/images/svgs/icon-dd-message-box.svg',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      img: '/assets/images/svgs/icon-dd-application.svg',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 2,
      title: 'Authentication Design',
      link: '/authentication/side-login',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    },
    {
      id: 5,
      title: 'Notes App',
      link: '/apps/notes',
    },
    {
      id: 6,
      title: 'Employee App',
      link: '/apps/employee',
    },
    {
      id: 7,
      title: 'Todo Application',
      link: '/apps/todo',
    },
    {
      id: 8,
      title: 'Treeview',
      link: '/theme-pages/treeview',
    },
  ];
}
