import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormalModeComponent} from "./pages/mural/normal-mode/normal-mode.component";
import { PreparationModeComponent} from "./pages/mural/preparation-mode/preparation-mode.component";
import {RushModeComponent} from "./pages/mural/rush-mode/rush-mode.component";

const routes: Routes = [
  { path: 'normal-mode', component: NormalModeComponent },
  { path: 'preparation-mode', component: PreparationModeComponent },
  { path: 'rush-mode', component: RushModeComponent},
  { path: '', redirectTo: '/normal-mode', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
