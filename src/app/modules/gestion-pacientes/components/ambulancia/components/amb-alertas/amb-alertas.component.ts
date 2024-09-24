import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-amb-alertas',
  templateUrl: './amb-alertas.component.html',
  styleUrl: './amb-alertas.component.scss',
  providers: 
  [
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-PE'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class AmbAlertasComponent implements OnInit
{
  hoyFecha =  new Date();

  options = this.settings.getOptions();
  form: UntypedFormGroup;
  description:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  footerToDisplayed: string[] = ["footer"];
  isLoadingResults = true;
  loading$: Observable<boolean>;

  displayedColumns: string[] = 
    [
      'atencion',
      'tipo_alerta',
      'usuario_alerta',
      'alerta',
      'fecha_alerta',
      'estado',
      'fecha_respuesta',
      'hora_respuesta',
      'usuario_respuesta'
    ];

  constructor
  (
      private settings: CoreService,
      private formBuilder: UntypedFormBuilder,
      private dialogRef: MatDialogRef<AmbAlertasComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) 
  {
      // this.description = data.description;
  }

  createFormGroup(): void 
  {
    this.form = this.formBuilder.group({
      dtpDesde: [this.hoyFecha],
      dtpHasta: [this.hoyFecha],
    });
  }

  ngOnInit() 
  {
    this.createFormGroup();
  }
  close() 
  {
      this.dialogRef.close();
  }
}
