import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AmbSoporteComponent } from '../amb-soporte/amb-soporte.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';
import { ToastrService } from 'ngx-toastr';
import { ListadopacientesComponent } from '../../../sctr/components/sctr-listado-pacientes/listado-pacientes.component';
import { AmbNuevaOrientacionMedicaComponent } from '../amb-nueva-orientacion-medica/amb-nueva-orientacion-medica.component';
import { AmbNuevaAtencionComponent } from '../amb-nueva-atencion/amb-nueva-atencion.component';
import { AmbSitedsComponent } from '../amb-siteds/amb-siteds.component';
import { AmbNuevoEventoComponent } from '../amb-nuevo-evento/amb-nuevo-evento.component';

@Component({
    selector: 'app-amb-nuevo-servicio',
    templateUrl: './amb-nuevo-servicio.component.html',
    styleUrl: './amb-nuevo-servicio.component.scss'
})
export class AmbNuevoServicioComponent implements OnInit {
    options = this.settings.getOptions();
    form: FormGroup;
    description: string;
    valRbServicio: boolean = true;

    constructor
        (
            private _dialog: MatDialog,
            private settings: CoreService,
            private fb: FormBuilder,
            private dialogRef: MatDialogRef<AmbNuevoServicioComponent>,
            @Inject(MAT_DIALOG_DATA) data,
            private toastrService: ToastrService) {

        // this.description = data.description;
    }

    ngOnInit() {
        this.form = this.fb.group({
            rbServicio: [1, Validators.required]
        });
    }

    continuar() {
        if (this.form.value["rbServicio"] == 1) {
            //NUEVA ATENCION EN EMERGENCIA – URGENCIA – TRASLADO
            localStorage.setItem('tipoServicio', 'I');
            localStorage.setItem('eventoAdverso', 'No');
            const dialogSiteds = this._dialog.open(AmbSitedsComponent, {
                panelClass: 'sanna_theme',
                disableClose: true,
                width: '950px',
                data: { 'servicio': 'Ambulancia' }
            });

            dialogSiteds.afterClosed().subscribe(result => {
                if (result.data) {
                    //console.log(result.data)
                    const dialogRefAte = this._dialog.open(AmbNuevaAtencionComponent, {
                        panelClass: 'sanna_theme',
                        disableClose: true,
                        width: '1100px',
                        data: result
                    });

                    dialogRefAte.afterClosed().subscribe(result => {
                        this.dialogRef.close(true);
                    });
                } else {
                    this.dialogRef.close(true);
                    //this.toastrService.warning('¡Por favor seleccione un paciente!');
                }
            });
        } else if (this.form.value["rbServicio"] == 2) {
            //NUEVO EVENTO
            localStorage.setItem('tipoServicio', 'P');
            localStorage.setItem('eventoAdverso', 'No');
            const dialogSiteds = this._dialog.open(AmbSitedsComponent, {
                panelClass: 'sanna_theme',
                disableClose: true,
                width: '950px',
                data: { 'servicio': 'Ambulancia' }
            });

            dialogSiteds.afterClosed().subscribe(result => {
                if (result.data) {
                    //console.log(result.data)
                    const dialogRefAte = this._dialog.open(AmbNuevoEventoComponent, {
                        panelClass: 'sanna_theme',
                        disableClose: true,
                        width: '1100px',
                        data: result
                    });

                    dialogRefAte.afterClosed().subscribe(result => {
                        this.dialogRef.close(true);
                    });
                } else {
                    this.dialogRef.close(true);
                    //this.toastrService.warning('¡Por favor seleccione un paciente!');
                }
            });
        } else if (this.form.value["rbServicio"] == 3) {
            //NUEVA EVENTO ADVERSO
            localStorage.setItem('tipoServicio', 'I');
            localStorage.setItem('eventoAdverso', 'Si');
            const dialogSiteds = this._dialog.open(AmbSitedsComponent, {
                panelClass: 'sanna_theme',
                disableClose: true,
                width: '950px',
                data: { 'servicio': 'Ambulancia' }
            });

            dialogSiteds.afterClosed().subscribe(result => {
                if (result.data) {
                    //console.log(result.data)
                    const dialogRefAte = this._dialog.open(AmbNuevaAtencionComponent, {
                        panelClass: 'sanna_theme',
                        disableClose: true,
                        width: '1100px',
                        data: result
                    });

                    dialogRefAte.afterClosed().subscribe(result => {
                        this.dialogRef.close(true);
                    });
                } else {
                    this.dialogRef.close(true);
                    //this.toastrService.warning('¡Por favor seleccione un paciente!');
                }
            });
        } else if (this.form.value["rbServicio"] == 4) {
            //NUEVA ORIENTACION MÉDICA
            localStorage.setItem('tipoServicio', 'OM');
            localStorage.setItem('eventoAdverso', 'No');
            const dialogSiteds = this._dialog.open(AmbSitedsComponent, {
                panelClass: 'sanna_theme',
                disableClose: true,
                width: '950px',
                data: { 'servicio': 'Ambulancia' }
            });

            dialogSiteds.afterClosed().subscribe(result => {
                if (result.data) {
                    const dialogRefAte = this._dialog.open(AmbNuevaOrientacionMedicaComponent, {
                        panelClass: 'sanna_theme',
                        disableClose: true,
                        width: '450px',
                        data: result
                    });

                    dialogRefAte.afterClosed().subscribe(result => {
                        this.dialogRef.close(true);
                    });
                } else {
                    this.dialogRef.close(true);
                    //this.toastrService.warning('¡Por favor seleccione un paciente!');
                }
            });
        }
    }

    close() {
        this.dialogRef.close();
    }
}
