import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MaterialModule } from '../../../material.module';

import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,MaterialModule,NgIf,FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent 
{
  options = this.settings.getOptions();

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() 
  {
    return this.form.controls;
  }

  submit() 
  {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }

  constructor(private settings: CoreService, private router: Router) {}
}
