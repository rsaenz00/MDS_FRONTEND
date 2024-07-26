import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgLocaleLocalization, PathLocationStrategy } from '@angular/common';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Import Layouts
import { FullComponent } from './views/layout/full/full.component';
import { BlankComponent } from './views/layout/blank/blank.component';

import { FilterPipe } from './pipe/filter.pipe';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { HttpInterceptorModule } from './http-interceptor.module';
import { MainblankComponent } from './views/layout/full/components/mainblank/mainblank.component';
import { MainComponent } from './views/layout/full/components/main/main.component';
import { WelcomeCardComponent } from './views/layout/full/shared/welcome-card/welcome-card.component';
// import { BaseComponent } from './base/base.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    FilterPipe,
    // BaseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MainblankComponent,
    MainComponent,
    NgScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot(),
    HttpInterceptorModule
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
  providers: [
    { provide: NgLocaleLocalization, useClass: PathLocationStrategy }
  ]
})
export class AppModule { }
