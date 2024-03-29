import { Component } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { AppSettings } from '../../../app.config';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss'
})
export class BlankComponent 
{
  private htmlElement!: HTMLHtmlElement;

  options = this.settings.getOptions();

  constructor (private settings: CoreService) 
  {
    this.htmlElement = document.querySelector('html')!;
     // Initialize project theme with options
     this.receiveOptions(this.options);
  }

  receiveOptions(options: AppSettings): void 
  {
    this.options = options;
    this.toggleDarkTheme(options);
  }

  toggleDarkTheme(options: AppSettings) 
  {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }
  }
}
