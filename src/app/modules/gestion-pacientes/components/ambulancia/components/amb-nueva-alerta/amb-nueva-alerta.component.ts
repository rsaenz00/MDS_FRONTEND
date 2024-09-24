import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-amb-nueva-alerta',
  templateUrl: './amb-nueva-alerta.component.html',
  styleUrl: './amb-nueva-alerta.component.scss'
})
export class AmbNuevaAlertaComponent 
{
  options = this.settings.getOptions();
  form: FormGroup;
  
  constructor
  (
      private settings: CoreService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AmbNuevaAlertaComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) 
  {
      // this.description = data.description;
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
