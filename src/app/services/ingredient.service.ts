import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay, forkJoin, Observable, of} from "rxjs";
import {Ingredients} from "../ingredients.interface";


@Injectable()
export class IngredientService {
  constructor(private http: HttpClient) {}

  getAllIngredients(): Observable<Ingredients> {
    return forkJoin({
      pantry: this.getPantryIngredients(),
      fridge: this.getFridgeIngredients(),
      garden: this.getGardenIngredients()
    });
  }

  private getPantryIngredients(): Observable<string[]> {
    console.log('fetching pantry ingredients');
    return of(['flour', 'water', 'olives', 'olive oil', 'spices']).pipe(delay(2000));
    //return this.http.get<string[]>('api/pantry');
  }

  private getFridgeIngredients(): Observable<string[]> {
    console.log('fetching fridge ingredients');
    return of(['yeast', 'cheese', 'pepperoni']).pipe(delay(2000));
    //return this.http.get<string[]>('api/fridge');
  }

  private getGardenIngredients(): Observable<string[]> {
    console.log('fetching garden ingredients');
    return of(['bell pepper', 'tomatoes']).pipe(delay(2000));
    //return this.http.get<string[]>('api/garden');
  }

}
