import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {VoteSelectorComponent} from "./vote-selector/vote-selector.component";

const routes: Routes = [
  {path : "", component: HomeComponent},
  {path : "about", component: AboutComponent},
  {path: ":group", component: VoteSelectorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
