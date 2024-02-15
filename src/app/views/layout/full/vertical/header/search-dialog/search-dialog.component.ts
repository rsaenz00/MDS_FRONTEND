import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { navItems } from '../../sidebar/sidebar-data';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-vertical-search-dialog',
  standalone: true,
  imports: [RouterModule,MaterialModule,TablerIconsModule,FormsModule,NgForOf,],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})

export class VerticalSearchDialogComponent 
{
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);
}
