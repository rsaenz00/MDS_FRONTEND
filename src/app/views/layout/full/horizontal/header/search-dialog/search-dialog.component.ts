import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { navItems } from '../../../vertical/sidebar/sidebar-data';

@Component({
  selector: 'app-horizontal-search-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule, NgForOf],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class HorizontalSearchDialogComponent 
{
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);
}
