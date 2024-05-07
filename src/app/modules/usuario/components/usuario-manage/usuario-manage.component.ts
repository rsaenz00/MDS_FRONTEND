import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';


@Component({
  standalone:true,
  selector: 'app-usuario-manage',
  templateUrl: './usuario-manage.component.html',
  styleUrl: './usuario-manage.component.scss',
  imports:[MaterialModule,TablerIconsModule,MatDatepickerModule],
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
export class UsuarioManageComponent 
{
  constructor
  (
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
  ) 
  {}

  ngOnInit() 
  {
    this.locale = 'es';
    this.adapter.setLocale(this.locale);
  }
}
