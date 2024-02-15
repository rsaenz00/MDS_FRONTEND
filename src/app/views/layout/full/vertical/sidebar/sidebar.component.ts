import { Component, OnInit } from '@angular/core';
import { BrandingComponent } from './branding.component';

@Component({
  selector: 'app-vertical-sidebar',
  standalone: true,
  imports: [BrandingComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class VerticalSidebarComponent implements OnInit
{
  constructor() {}

  ngOnInit(): void {}
}
