import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sctr-soporte',
  templateUrl: './sctr-soporte.component.html',
  styleUrl: './sctr-soporte.component.scss',
  standalone: true,
  imports: [MatRadioModule, FormsModule, MatDialogModule, MatButtonModule]
})
export class SctrSoporteComponent {

}
