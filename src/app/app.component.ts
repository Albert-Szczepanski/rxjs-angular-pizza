import { Component } from '@angular/core';
import {PizzaService} from "./services/pizza.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private pizzaService: PizzaService) {}
  title = 'RxJS-in-Angular';

  onGetPizza() {
    this.pizzaService.cook();
  }
}
