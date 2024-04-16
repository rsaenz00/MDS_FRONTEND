import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MadSitedsComponent } from '../mad-siteds/mad-siteds.component';
import { MadDireccionesComponent } from '../mad-direcciones/mad-direcciones.component';

@Component({
  selector: 'app-mad-nuevatencion',
  templateUrl: './mad-nuevatencion.component.html',
  styleUrl: './mad-nuevatencion.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatDialogModule, MatButtonModule]
})

export class MadNuevatencionComponent {
  constructor(private _dialog: MatDialog) {
  }

  openDatosSitedsDialog() {
    this._dialog.open(MadSitedsComponent);
  }

  openDireccionesDialog() {
    this._dialog.open(MadDireccionesComponent);
  }

}