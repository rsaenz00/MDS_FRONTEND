import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.scss',
  imports: [MaterialModule],
})
export class WelcomeCardComponent {

}
