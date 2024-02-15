import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MaterialModule } from '../../../material.module';

import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
})
export class LoginComponent 
{
  options = this.settings.getOptions();
  
  constructor(private settings: CoreService, private router: Router) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() 
  {
    return this.form.controls;
  }

  submit() 
  {
    this.router.navigate(['/dashboards/dashboard1']);
  }
}
