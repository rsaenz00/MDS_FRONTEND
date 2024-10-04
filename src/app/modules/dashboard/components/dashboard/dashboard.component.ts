import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base/base.component';
import { Usuario } from 'src/app/models/usuario';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PaymentGatewaysComponent } from 'src/app/views/layout/full/shared/payment-gateways/payment-gateways.component';
import { PaymentsComponent } from 'src/app/views/layout/full/shared/payments/payments.component';
import { ProductsComponent } from 'src/app/views/layout/full/shared/products/products.component';
import { TopCardsComponent } from 'src/app/views/layout/full/shared/top-cards/top-cards.component';
import { TopProjectsComponent } from 'src/app/views/layout/full/shared/top-projects/top-projects.component';
import { WelcomeCardComponent } from 'src/app/views/layout/full/shared/welcome-card/welcome-card.component';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: 
  [
    WelcomeCardComponent,
    TopCardsComponent,
    PaymentsComponent,
    ProductsComponent,
    PaymentGatewaysComponent,
    TopProjectsComponent
  ]
})
export class DashboardComponent extends BaseComponent implements OnInit
{
  recentlyRegisteredUsers: Array<Usuario> = [];
  totalUserCount = 0;
  activeUserCount = 0;
  inactiveUserCount = 0;
  onlineUsers: Usuario[];
  onlinerUsersCount: number = 0;

  constructor
  ( 
    private usuarioService: UsuarioService,
    private dashboardService: DashboardService,
    // private signalrService: SignalrService
  ) 
  {
    super();
  }

  ngOnInit() 
  {
    // this.getRecentlyRegisteredUsers();
    // this.getRecentlyRegisteredUsers();
    // this.getActiveUserCount();
    // this.getInactiveUserCount();
    // this.getTotalUserCount();
    // this.getOnlineUsers();
  }

  // getOnlineUsers() {
  //   this.sub$.sink = this.signalrService.onlineUsers$.subscribe(c => {
  //     if (c) {
  //       this.sub$.sink = this.dashboardService.getOnlineUser()
  //         .subscribe((resp: User[]) => {
  //           this.onlineUsers = resp;
  //           this.onlineUsers.forEach(user => {
  //             if (user.profilePhoto) {
  //               user.profilePhoto = `${environment.apiUrl}${user.profilePhoto}`
  //             }
  //           })
  //         });
  //       this.onlinerUsersCount = c.length;
  //     } else {
  //       this.onlineUsers = [];
  //       this.onlinerUsersCount = 0;
  //     }
  //   })
  // }

  getRecentlyRegisteredUsers() 
  {
    this.sub$.sink = this.usuarioService.GetRecentlyRegisteredUsers().subscribe((usuarios: any) => {
      this.recentlyRegisteredUsers = usuarios;
    });
  }

  getActiveUserCount() 
  {
    this.sub$.sink = this.dashboardService.getActiveUserCount().subscribe((count: any) => this.activeUserCount = count);
  }

  getInactiveUserCount() 
  {
    this.sub$.sink = this.dashboardService.getInactiveUserCount().subscribe((count: any) => this.inactiveUserCount = count);
  }

  getTotalUserCount() 
  {
    this.sub$.sink = this.dashboardService.getTotalUserCount().subscribe((count: any) => this.totalUserCount = count);
  }
}
