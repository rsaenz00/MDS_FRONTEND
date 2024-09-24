import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';
import { AmbMotivoAnularServicioComponent } from '../amb-motivo-anular-servicio/amb-motivo-anular-servicio.component';

@Component({
    selector: 'app-amb-soporte',
    templateUrl: './amb-soporte.component.html',
    styleUrl: './amb-soporte.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AmbSoporteComponent implements OnInit {
    dataAtencion: any;
    estadoAtencion: string;
    options = this.settings.getOptions();
    formAnularServicio: FormGroup;
    description: string;

    constructor
        (
            private settings: CoreService,
            private fb: FormBuilder,
            private dialogRef: MatDialogRef<AmbSoporteComponent>,
            @Inject(MAT_DIALOG_DATA) data,
            private _dialog: MatDialog,
            private toastrService: ToastrService
        ) {
        this.dataAtencion = data.datos_atencion;
        this.estadoAtencion = this.dataAtencion.estado;
        // this.description = data.description;
    }

    ngOnInit() {
        this.formAnularServicio = this.fb.group({
            // description: [this.description, []],
            rbSoporte: [Validators.required]
        });
    }

    continuar() {
        //console.log(this.formAnularServicio.value)
        if (this.formAnularServicio.valid) {
            if (this.formAnularServicio.get('rbSoporte')?.value == 1) {
                const dialog = this._dialog.open(AmbMotivoAnularServicioComponent, {
                    panelClass: 'sanna_theme',
                    data: { 'codAtencionEditar': this.dataAtencion.cod_historia_clinica },
                    disableClose: true,
                    width: '430px'
                });

                dialog.afterClosed().subscribe(result => {
                    this.dialogRef.close(true);
                });
            } else {
                this.toastrService.warning('Esta opción se encuentra en mantenimiento');
            }
        } else {
            this.toastrService.warning('Seleccione una opción para dar Soporte');
        }

        //this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
}
