import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PositionComponent } from './shared/components/position/position.component';
import { TableComponent } from './shared/components/table/table.component';
import { DishComponent } from './shared/components/dish/dish.component';
import { NormalModeComponent } from './pages/mural/normal-mode/normal-mode.component';
import {HttpClientModule} from "@angular/common/http";
import { RushModeComponent } from './pages/mural/rush-mode/rush-mode.component';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { MatMenuItem } from "@angular/material/menu";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { PreparationModeComponent } from './pages/mural/preparation-mode/preparation-mode.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {AppRoutingModule} from "./app-routing-module";
import { HeaderComponent } from './shared/components/header/header.component';
import { TimelineComponent } from './shared/components/timeline/timeline.component';
import { IngredientComponent } from './shared/components/ingredient/ingredient.component';
import { TableModeComponent } from './pages/mural/table-mode/table-mode.component';
import { ModificationModeComponent } from './pages/mural/modification-mode/modification-mode.component';

@NgModule({
  declarations: [
    AppComponent,
    PositionComponent,
    TableComponent,
    DishComponent,
    RushModeComponent,
    NormalModeComponent,
    SettingsComponent,
    NormalModeComponent,
    PreparationModeComponent,
    HeaderComponent,
    TimelineComponent,
    IngredientComponent,
    TableModeComponent,
    ModificationModeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
