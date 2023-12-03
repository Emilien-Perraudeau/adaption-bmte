import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PositionComponent } from './shared/components/position/position.component';
import { TableComponent } from './shared/components/table/table.component';
import { DishComponent } from './shared/components/dish/dish.component';
import { SideTableComponent } from './shared/components/side-table/side-table.component';
import { RecipeComponent } from './shared/components/recipe/recipe.component';
import { NormalModeComponent } from './pages/mural/normal-mode/normal-mode.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    PositionComponent,
    TableComponent,
    DishComponent,
    SideTableComponent,
    RecipeComponent,
    NormalModeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
