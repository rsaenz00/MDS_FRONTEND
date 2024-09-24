import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewsRoutes } from './views-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { StarterComponent } from './layout/starter/starter.component';
import { MainComponent } from './layout/full/components/main/main.component';
import { MainblankComponent } from './layout/full/components/mainblank/mainblank.component';
import { WelcomeCardComponent } from './layout/full/shared/welcome-card/welcome-card.component';
import { TopCardsComponent } from './layout/full/shared/top-cards/top-cards.component';
import { PaymentsComponent } from './layout/full/shared/payments/payments.component';
import { ProductsComponent } from './layout/full/shared/products/products.component';
import { PaymentGatewaysComponent } from './layout/full/shared/payment-gateways/payment-gateways.component';
import { TopProjectsComponent } from './layout/full/shared/top-projects/top-projects.component';
import { CommonDialogComponent } from './layout/full/shared/common-dialog/common-dialog.component';


@NgModule({
  declarations: [
    // MainComponent,
    // MainblankComponent,
    // WelcomeCardComponent,
    // TopCardsComponent,
    // PaymentsComponent,
    // ProductsComponent,
    // PaymentGatewaysComponent,
    // TopProjectsComponent
  
    CommonDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(ViewsRoutes),
    StarterComponent
  ]
})
export class ViewsModule { }
