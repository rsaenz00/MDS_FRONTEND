import { CommonModule, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router } from '@angular/router';
import { NavService } from '../../../../../../services/nav.service';

@Component({
  selector: 'app-horizontal-nav-item',
  standalone: true,
  imports: [TablerIconsModule,CommonModule,MatIconModule,NgForOf],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})

export class HorizontalNavItemComponent implements OnInit
{
  @Input() depth: any;
  @Input() item: any;

  constructor(public navService: NavService, public router: Router) 
  {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
  
  ngOnInit() {}

  onItemSelected(item: any) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
  }
}
