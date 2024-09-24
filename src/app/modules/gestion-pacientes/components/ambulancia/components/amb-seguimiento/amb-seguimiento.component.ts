import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-amb-seguimiento',
  templateUrl: './amb-seguimiento.component.html',
  styleUrl: './amb-seguimiento.component.scss'
})
export class AmbSeguimientoComponent implements OnInit
{
  options = this.settings.getOptions();
  form: UntypedFormGroup;
  description:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  displayedColumns: string[] = ['cod_ate','cod_ped','cod_lab','des_ser','tipo_seg','observacion','fecha_registro','hora_registro','usuario'];
  
  constructor
  (
      private settings: CoreService,
      private formBuilder: UntypedFormBuilder,
      private dialogRef: MatDialogRef<AmbSeguimientoComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) 
  {
      // this.description = data.description;
  }

  createFormGroup(): void 
  {
    this.form = this.formBuilder.group({
    });
  }

  ngOnInit() 
  {
    this.createFormGroup();
  }

  save() 
  {
    this.dialogRef.close(this.form.value);
  }

  close() 
  {
      this.dialogRef.close();
  }

}
