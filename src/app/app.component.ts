import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './base/base.component';
import { SignalrService } from './helpers/signalr/signalr.service';
import { SecurityService } from './helpers/security/security.service';
import { UsuarioEnlinea } from './models/usuario-enlinea';
import { UsuarioAuth } from './models/usuario-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends BaseComponent implements OnInit
{
  title = 'MediSanna';

  constructor
  (
    private signalrService: SignalrService,
    private securityService: SecurityService
  )
  {
    super();
  }

  ngOnInit() 
  {
    // this.signalrService.startConnection().then(resolve => 
    // {
    //   if (resolve) 
    //   {
    //     this.signalrService.handleMessage();
    //     this.getAuthObj();
    //   }
    // });
  }

  getAuthObj() 
  {
    this.sub$.sink = this.securityService.securityObject$
      .subscribe((c: UsuarioAuth) => 
      {
        if (c) 
        {
          const online: UsuarioEnlinea = 
          {
            usuario: c.usuario as string,
            id: c.id as string,
            connectionId: this.signalrService.connectionId
          };
          this.signalrService.addUser(online);
        }
      });
  }
}
