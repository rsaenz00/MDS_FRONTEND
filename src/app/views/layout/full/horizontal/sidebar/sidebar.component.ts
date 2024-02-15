import { ChangeDetectorRef, Component, OnInit,Input } from '@angular/core';
import { HorizontalNavItemComponent } from './nav-item/nav-item.component';
import { navItems } from '../../vertical/sidebar/sidebar-data';
import { NavService } from '../../../../../services/nav.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-horizontal-sidebar',
  standalone: true,
  imports: [HorizontalNavItemComponent,NgIf, NgForOf, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class HorizontalSidebarComponent implements OnInit
{
  navItems = navItems;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    public navService: NavService,
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) 
  {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {}
}
