import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../../../material.module';

@Component({
  standalone: true,
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrl: './common-dialog.component.scss',
  imports: [CommonModule, MaterialModule]

})
export class CommonDialogComponent {
  primaryMessage: string;
  options = this.settings.getOptions();

  constructor
    (
      private settings: CoreService,
      public dialogRef: MatDialogRef<CommonDialogComponent>
    ) {

  }

  clickHandler(data): void {
    this.dialogRef.close(data);
  }
}
