import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/services/core.service';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';

@Component({
  selector: 'app-sctr-verdatos',
  templateUrl: './sctr-verdatos.component.html',
  styleUrl: './sctr-verdatos.component.scss'
})

export class SctrVerdatosComponent {
  options = this.settings.getOptions();
  cod_historia_clinica: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _historiaClinicaService: HistoriaClinicaService, private frm: FormBuilder, private settings: CoreService) {
    this.cod_historia_clinica = data.cod_historia_clinica
  }

  formularioVerDatosAtencion = this.frm.group({
    txtCodigoAtencion: [{ value: '', disabled: true }],
    txtPaciente: [{ value: '', disabled: true }],
    txtFechaNacimiento: [{ value: '', disabled: true }],
    txtEdad: [{ value: '', disabled: true }],
    txtSexo: [{ value: '', disabled: true }],
    txtPais: [{ value: '', disabled: true }],
    txtDocIdentidad: [{ value: '', disabled: true }],
    txtNumDocIdentidad: [{ value: '', disabled: true }],
    txtCelular: [{ value: '', disabled: true }],
    txtAseguradora: [{ value: '', disabled: true }],
    txtEmpresa: [{ value: '', disabled: true }],
    txtRuc: [{ value: '', disabled: true }],
    txtTelefonoEmpresa: [{ value: '', disabled: true }],
    txtAnexoEmpresa: [{ value: '', disabled: true }],
    txtClinica: [{ value: '', disabled: true }],
    txtHorarioTrabajo: [{ value: '', disabled: true }],
    txtCargo: [{ value: '', disabled: true }],
    txtRelato: [{ value: '', disabled: true }],
    txtFechaAccidente: [{ value: '', disabled: true }],
    txtHoraAccidente: [{ value: '', disabled: true }],
    txtTipoAtencion: [{ value: '', disabled: true }],
    txtPaseAtencion: [{ value: '', disabled: true }],
    txtMotivo: [{ value: '', disabled: true }],
    txtObservacion: [{ value: '', disabled: true }],
    txtClinicaPrimeraCita: [{ value: '', disabled: true }]
  })

  ngOnInit(): void {
    this.getAtencionByCodigo(this.cod_historia_clinica);
  }

  getAtencionByCodigo(cod_historia_clinica: string) {
    this._historiaClinicaService.GetHistoriaClinicaSctrByCodigo(cod_historia_clinica).subscribe({
      next: (res) => {
        //console.log(res.resultData[0]);
        this.formularioVerDatosAtencion.controls['txtCodigoAtencion'].setValue(res.resultData[0].cod_historia_clinica);
        this.formularioVerDatosAtencion.controls['txtPaciente'].setValue(res.resultData[0].paciente);
        this.formularioVerDatosAtencion.controls['txtFechaNacimiento'].setValue(res.resultData[0].fecha_nacimiento);
        this.formularioVerDatosAtencion.controls['txtEdad'].setValue(res.resultData[0].edad);
        this.formularioVerDatosAtencion.controls['txtSexo'].setValue(res.resultData[0].sexo);
        this.formularioVerDatosAtencion.controls['txtPais'].setValue(res.resultData[0].pais);
        this.formularioVerDatosAtencion.controls['txtDocIdentidad'].setValue(res.resultData[0].documento_identidad);
        this.formularioVerDatosAtencion.controls['txtNumDocIdentidad'].setValue(res.resultData[0].numero_documento_id);
        this.formularioVerDatosAtencion.controls['txtCelular'].setValue(res.resultData[0].celular);
        this.formularioVerDatosAtencion.controls['txtAseguradora'].setValue("PACIFICO S.A. ENT. PRESTADORA DE SALUD");
        this.formularioVerDatosAtencion.controls['txtEmpresa'].setValue(res.resultData[0].empresa);
        this.formularioVerDatosAtencion.controls['txtRuc'].setValue(res.resultData[0].empresa_ruc);
        this.formularioVerDatosAtencion.controls['txtTelefonoEmpresa'].setValue(res.resultData[0].ipress_telefono);
        this.formularioVerDatosAtencion.controls['txtAnexoEmpresa'].setValue(res.resultData[0].ipress_anexo);
        this.formularioVerDatosAtencion.controls['txtClinica'].setValue(res.resultData[0].descripcion_ipress);
        this.formularioVerDatosAtencion.controls['txtHorarioTrabajo'].setValue(res.resultData[0].horario_trabajo);
        this.formularioVerDatosAtencion.controls['txtCargo'].setValue(res.resultData[0].puesto_cargo);
        this.formularioVerDatosAtencion.controls['txtRelato'].setValue(res.resultData[0].relato);
        this.formularioVerDatosAtencion.controls['txtFechaAccidente'].setValue(res.resultData[0].fecha_accidente);
        this.formularioVerDatosAtencion.controls['txtHoraAccidente'].setValue(res.resultData[0].hora_accidente);
        this.formularioVerDatosAtencion.controls['txtTipoAtencion'].setValue(res.resultData[0].tipo_atencion);
        this.formularioVerDatosAtencion.controls['txtPaseAtencion'].setValue(res.resultData[0].tipo_pase_atencion);
        this.formularioVerDatosAtencion.controls['txtMotivo'].setValue(res.resultData[0].motivo);
        this.formularioVerDatosAtencion.controls['txtObservacion'].setValue(res.resultData[0].observacion);
        this.formularioVerDatosAtencion.controls['txtClinicaPrimeraCita'].setValue(res.resultData[0].ipress_primera_ate);
      },
      error: console.log,
    });
  }
}