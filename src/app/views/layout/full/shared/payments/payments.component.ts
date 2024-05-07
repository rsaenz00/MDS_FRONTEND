import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  standalone: true,
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
  imports: [MaterialModule, TablerIconsModule],
})
export class PaymentsComponent 
{

}
