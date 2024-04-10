import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.scss',
  standalone: true,
  imports: [MatRadioModule, FormsModule, MatDialogModule, MatButtonModule]
})
export class SoporteComponent {

}
