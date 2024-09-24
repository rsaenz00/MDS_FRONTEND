import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-amb-atenciones-pasadas',
  templateUrl: './amb-atenciones-pasadas.component.html',
  styleUrl: './amb-atenciones-pasadas.component.scss'
})

export class AmbAtencionesPasadasComponent implements OnInit
{
  options = this.settings.getOptions();
  form: UntypedFormGroup;

  displayedColumns: string[] = 
    [
      'nro_atencion',
      'paciente',
      'fecha_atencion',
      'unidad_negocio'
    ];

  createFormGroup(): void 
  {
    this.form = this.formBuilder.group
    ({
      
    });
  }

  ngOnInit() 
  {
    this.createFormGroup();
  }

  constructor
  (
      private settings: CoreService,
      private formBuilder: UntypedFormBuilder,
      private dialogRef: MatDialogRef<AmbAtencionesPasadasComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) 
  {
      // this.description = data.description;
  }
}
