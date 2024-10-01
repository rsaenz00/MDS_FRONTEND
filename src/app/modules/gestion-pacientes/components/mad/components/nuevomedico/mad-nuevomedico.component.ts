import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsuarioAuth } from 'src/app/models/usuario-auth';


@Component({
  selector: 'app-mad-nuevomedico',
  templateUrl: './mad-nuevomedico.component.html',
  styleUrl: './mad-nuevomedico.component.scss'
})

export class MadNuevoMedicoComponent implements OnInit {
    constructor(
      ) { }
      ngOnInit(): void {
        //this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
      }
}

