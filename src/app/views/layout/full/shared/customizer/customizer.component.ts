import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../../../material.module';
import { AppSettings } from '../../../../../app.config';
import { CoreService } from '../../../../../services/core.service';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-customizer',
  standalone: true,
  imports: [BrandingComponent,TablerIconsModule,MaterialModule,FormsModule,NgScrollbarModule,NgIf],
  templateUrl: './customizer.component.html',
  styleUrl: './customizer.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class CustomizerComponent 
{
  @Output() optionsChange = new EventEmitter<AppSettings>();
  
  constructor(private settings: CoreService) {}

  options = this.settings.getOptions();
  
  setDark() 
  {
    this.optionsChange.emit(this.options);
  }

  setColor() 
  {
    this.optionsChange.emit(this.options);
  }

  setDir() 
  {
    this.optionsChange.emit(this.options);
  }

  setSidebar() 
  {
    this.optionsChange.emit(this.options);
  }

  
}
