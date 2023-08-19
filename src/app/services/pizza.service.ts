import { Injectable } from '@angular/core';
import {concatMap, finalize, forkJoin, Observable, of, Subscription, tap} from 'rxjs';
import { switchMap, mergeMap, delay, shareReplay } from 'rxjs/operators';
import { IngredientService } from './ingredient.service'
import { Ingredients } from '../ingredients.interface';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  // Constructor to inject the IngredientService
  constructor(private ingredientService: IngredientService) {}
  private allIngredients$: Observable<Ingredients> = of({
    pantry: [],
    fridge: [],
    garden: []
  })

  pizza$: Observable<any> = of(null);
  private pizzaSubscription: Subscription | undefined;

  cook(){
    this.fetchAllIngredients();
    this.preparePizza();
    this.bake();
  }

  cleanUp(): void {
    if (this.pizzaSubscription) {
      this.pizzaSubscription.unsubscribe();
      console.log('Unsubscribed from pizza preparation.');
    }
  }

  private fetchAllIngredients(): void {
    this.allIngredients$ = this.ingredientService.getAllIngredients().pipe(
      shareReplay(1)
    );
  }

  private preparePizza(): void {
    this.pizza$ = this.prepare().pipe(
      tap(finalPizza => {
        console.log(finalPizza + ' Baking in progress...'); // Outputs "Toppings added!" Starting baking process...
      }),
      delay(15000), // Simulate baking time
      finalize(() => {
        console.log('Ending the process of pizza making!');
      })
    );
  }

  private bake(): void {
    if (!this.pizzaSubscription || this.pizzaSubscription.closed) {
      this.pizzaSubscription = this.pizza$.subscribe(
        finalPizza => {
          console.log('Pizza is ready!'); // Outputs "Toppings added!" Pizza is ready!
        },
        err => {
          console.error(err);
        },
        () => {
          console.log('Pizza preparation completed!');
          this.cleanUp();
        }
      );
    }
  }

  private initiatePizzaPreparation(): Observable<any> {
    return this.allIngredients$.pipe(
      switchMap(ingredients => {
        const doughIngredients: string[] = [
          ...ingredients.pantry.includes('flour') ? ['flour'] : [],
          ...ingredients.pantry.includes('water') ? ['water'] : [],
          ...ingredients.fridge.includes('yeast') ? ['yeast'] : []
        ];

        // Combine ingredients for dough
        return this.combineIngredients(doughIngredients);
      }),
      switchMap(() => {
        // Knead the dough
        return this.kneadDough();
      }),
      mergeMap(() => {
        // Let the dough rise and prepare the sauce at the same time
        return forkJoin([this.doughRise(), this.prepareSauce()]);
      })
    );
  }

  private prepareSauce(): Observable<any> {
    return this.allIngredients$.pipe(
      switchMap(ingredients => {
        const sauceIngredientsList: string[] = [
          ...ingredients.garden.includes('tomatoes') ? ['tomatoes'] : [],
          ...ingredients.pantry.includes('olive oil') ? ['olive oil'] : [],
          ...ingredients.pantry.includes('spices') ? ['spices'] : []
        ];

        return this.combineIngredients(sauceIngredientsList);
      }),
      switchMap(() => {
        // Cook the sauce
        return this.cookSauce();
      })
    );
  }

  private prepare(): Observable<string> {
    return this.initiatePizzaPreparation().pipe(
      concatMap(dough => this.flattenDough(dough)),
      concatMap(flattenedDough => this.spreadSauce(flattenedDough)),
      concatMap(saucedDough => this.addToppings(saucedDough))
    );
  }

  private flattenDough(dough: any): Observable<string> {
    console.log('Flattening the dough...')
    return of('Dough is flattened!').pipe(delay(5000)); // Simulating the dough flattening process
  }

  private spreadSauce(dough: any): Observable<string> {
    console.log('Spreading the sauce on the dough...');
    return of('Sauce is spread on the dough!').pipe(delay(5000)); // Simulating sauce spreading
  }

  private addToppings(saucedDough: any): Observable<any> {
    return this.allIngredients$.pipe(
      switchMap(ingredients => {
        const toppingIngredients: string[] = [
          ...ingredients.fridge.includes('cheese') ? ['cheese'] : [],
          ...ingredients.fridge.includes('pepperoni') ? ['pepperoni'] : [],
          ...ingredients.pantry.includes('olives') ? ['olives'] : [],
          ...ingredients.garden.includes('bell pepper') ? ['bell pepper'] : []
        ];

        const toppingsDescription = toppingIngredients.join(', ');
        return of(`Toppings ${toppingsDescription} added!`).pipe(delay(5000)); // Let's assume it takes 5 seconds to add toppings.
      })
    );
  }

  private combineIngredients(ingredients: string[]): Observable<any> {
    // Simulate combining ingredients process
    console.log(`Combining ingredients... [${ingredients.join(', ')}]`)
    return of("Ingredients combined!").pipe(delay(5000)); // 5 seconds delay as an example
  }

  private kneadDough(): Observable<any> {
    // Simulate kneading process
    console.log('Kneading dough...')
    return of("Dough kneaded!").pipe(delay(4000)); // 7 seconds delay as an example
  }

  private doughRise(): Observable<any> {
    // Simulate rising process
    console.log('Rising dough...')
    return of('Dough is ready!').pipe(delay(3000));
  }

  private cookSauce(): Observable<any> {
    // Simulate cooking process
    console.log('Cooking sauce...')
    return of('Sauce is ready!').pipe(delay(1000));
  }
}
