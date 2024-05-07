import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MotivoService } from 'src/app/services/motivo.services';
import { Motivo } from 'src/app/models/motivo.model';
import { SctrNuevatencionComponent } from '../nuevatencion/sctr-nuevatencion.component';
import { SctrRegistramotivoComponent } from '../registramotivo/sctr-registramotivo.component';

let rdSkill = 0, cboMotivo = 0;

@Component({
  selector: 'app-sctr-tiposervicio',
  templateUrl: './sctr-tiposervicio.component.html',
  styleUrl: './sctr-tiposervicio.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatDialogModule, MatButtonModule, CommonModule]
})

export class SctrTiposervicioComponent {

  constructor(private _motivoService: MotivoService, private _dialog: MatDialog, public _dialogRef: MatDialogRef<SctrTiposervicioComponent>) { }

  motivos: Motivo[];

  ngOnInit(): void {
    this.getMotivosList();
  }

  getMotivosList() {
    this._motivoService.GetMotivosList().subscribe({
      next: (res) => {
        this.motivos = res.resultData;
      },
      error: console.log,
    });
  }

  getSkill(target: any) {
    rdSkill = target.value;
  }

  getMotivoCbo(target: any) {
    cboMotivo = target.value;
  }

  nuevoServicioSctr() {

    if (cboMotivo != 0 && rdSkill != 0) {
      if (cboMotivo == 20) {

        const dialogRef = this._dialog.open(SctrNuevatencionComponent, {
          disableClose: true,
          data: { 'cboMotivo': cboMotivo, 'rdSkill': rdSkill }
        });

        dialogRef.afterClosed().subscribe(result => {
          this._dialogRef.close(true);
        });

      } else {

        const dialogRef = this._dialog.open(SctrRegistramotivoComponent, {
          disableClose: true,
          data: { 'cboMotivo': cboMotivo, 'rdSkill': rdSkill }
        });

        dialogRef.afterClosed().subscribe(result => {
          this._dialogRef.close(true);
        });
        
      }
    }

  }

}
