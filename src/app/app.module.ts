import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { VoteSelectorComponent } from './vote-selector/vote-selector.component';
import {NotFoundComponent} from "./not-found/not-found.component";
import {NoGroupComponent} from "./no-group/no-group.component";
import {HttpClientModule} from "@angular/common/http";
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    VoteSelectorComponent,
    NotFoundComponent,
    NoGroupComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
