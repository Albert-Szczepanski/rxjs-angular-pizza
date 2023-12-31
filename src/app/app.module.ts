import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {PizzaService} from "./services/pizza.service";
import {IngredientService} from "./services/ingredient.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [PizzaService, IngredientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
