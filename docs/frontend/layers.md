---
sidebar_position: 2
title: Layers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Frontend Layers

Let's consider the L of Mono**L**ISA for frontends: Layered Libraries.

We recommend the following layers for frontend applications:
* **User Interface**
* **Data Access**
* **Implementations**

## User Interface (UI) Layer
The User Interface (UI) Layer contains components that render the user interface.

### Presentational Components
The UI layer contains presentational or [dumb](https://chatgpt.com/share/696d587e-22c4-800d-83d3-90400e12ac31) components. They don’t know where data comes from or goes to. They render the user interface and raise events when users interact. 

### Interface Segregation
UI components must adhere to the Interface Segregation Principle (ISP).  This is where the I of MonoL**I**SA comes in.

UI components must use 100% of the data or fields they receive as input. They may not receive fields they don’t need. Going out, they may only output or emit data they know about.

### Example

Here's a UI component:

<Tabs groupId="framework">
<TabItem value="angular" label="Angular">

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface PizzaDisplay {
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-pizza-card',
  template: `
    <div class="pizza-card">
      <img [src]="pizza.imageUrl" [alt]="pizza.name" />
      <h3>{{ pizza.name }}</h3>
      <p class="price">\${{ pizza.price.toFixed(2) }}</p>
      <button (click)="onAddToCart.emit(pizza)">
        Add to Cart
      </button>
    </div>
  `
})
export class PizzaCardComponent {
  @Input() pizza: PizzaDisplay;
  @Output() onAddToCart = new EventEmitter<PizzaDisplay>();
}
```

</TabItem>
<TabItem value="react" label="React">

```tsx
interface PizzaDisplay {
  name: string;
  price: number;
  imageUrl: string;
}

interface PizzaCardProps {
  pizza: PizzaDisplay;
  onAddToCart: (pizza: PizzaDisplay) => void;
}

function PizzaCard({ pizza, onAddToCart }: PizzaCardProps) {
  return (
    <div className="pizza-card">
      <img src={pizza.imageUrl} alt={pizza.name} />
      <h3>{pizza.name}</h3>
      <p className="price">${pizza.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(pizza)}>
        Add to Cart
      </button>
    </div>
  );
}
```

</TabItem>
</Tabs>


This component demonstrates key principles:

**Interface Segregation**:
The `PizzaDisplay` interface contains only the three fields needed for display (`name`, `price`, `imageUrl`). It doesn't include fields like `id`, `ingredients`, `description`, or `isVegetarian` that the component doesn't use.

**Presentation Only**: The component:
- Doesn't know where its data is coming from or going to.
- Just renders what it receives and emits an event when clicked.

### Constraints
Libraries of the UI layer:
- May only have presentational (dumb) components.
- May not depend on the other layers.
- Must adhere to the Interface Segregation Principle (ISP).

## Data Access Layer

The Data Access Layer is responsible for communicating with the backend for frontend (BFF).

It fetches all the data the frontend needs. It sends data updates and requests to the BFF.

### Example

Here's an example of the Data Access layer:

<Tabs groupId="framework">
<TabItem value="angular" label="Angular">

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Pizza {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  description: string;
  isVegetarian: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PizzaDataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/pizzas';

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.apiUrl);
  }

  getPizzaById(id: string): Observable<Pizza> {
    return this.http.get<Pizza>(`${this.apiUrl}/${id}`);
  }

  updatePizza(id: string, pizza: Partial<Pizza>): Observable<Pizza> {
    return this.http.patch<Pizza>(`${this.apiUrl}/${id}`, pizza);
  }
}
```

</TabItem>
<TabItem value="react" label="React">

```tsx
interface Pizza {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  description: string;
  isVegetarian: boolean;
}

const API_URL = '/api/pizzas';

export const pizzaDataService = {
  async getPizzas(): Promise<Pizza[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch pizzas');
    }
    return response.json();
  },

  async getPizzaById(id: string): Promise<Pizza> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pizza ${id}`);
    }
    return response.json();
  },

  async updatePizza(id: string, pizza: Partial<Pizza>): Promise<Pizza> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pizza),
    });
    if (!response.ok) {
      throw new Error(`Failed to update pizza ${id}`);
    }
    return response.json();
  },
};
```

</TabItem>
</Tabs>

Notice how the `Pizza` interface contains all fields returned by the BFF, including many that the UI layer doesn't need (like `ingredients`, `description`, `isVegetarian`, etc.). The Implementation Layer will map this to the simpler `PizzaDisplay` interface that the UI components require.

### Constraints
Libraries of the Data Access layer:
- May only have services or functions that communicate with the BFF.
- May not have any UI components.
- May not depend on the other layers.

## Implementation Layer

The Implementation Layer is responsible for orchestrating data flow between the UI and Data Access layers.

It 'implements' the UI and data access services. It acts as a bridge between the UI components and the data access services or functions. In particular, it maps from the BFF's models to the UI's interfaces. And vice versa.

### Container components

The implementation layer has container (smart) components. They know where data comes from and where it goes to. They fetch data from the Data Access layer, handle business logic, and pass data to presentational components in the UI layer.

### Example

Here's an example of how the implementation layer works:

<Tabs groupId="framework">
<TabItem value="angular" label="Angular">

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PizzaDataService } from '../data-access/pizza-data.service';
import { PizzaCardComponent, PizzaDisplay } from '../ui/pizza-card.component';

@Component({
  selector: 'app-pizza-list-container',
  standalone: true,
  imports: [CommonModule, PizzaCardComponent],
  template: `
    <div class="pizza-list">
      @for (pizza of pizzas$ | async; track pizza.name) {
        <app-pizza-card 
          [pizza]="pizza"
          (onAddToCart)="handleAddToCart($event)"
        />
      }
    </div>
  `
})
export class PizzaListContainerComponent {
  private readonly pizzaDataService = inject(PizzaDataService);

  // Map from BFF's Pizza model to UI's PizzaDisplay interface
  pizzas$: Observable<PizzaDisplay[]> = this.pizzaDataService
    .getPizzas()
    .pipe(
      map(pizzas => pizzas.map(pizza => ({
        name: pizza.name,
        price: pizza.price,
        imageUrl: pizza.imageUrl
      })))
    );

  handleAddToCart(pizza: PizzaDisplay): void {
    // Handle business logic, potentially calling data service
    console.log('Adding to cart:', pizza);
  }
}
```

</TabItem>
<TabItem value="react" label="React">

```tsx
import { useEffect, useState } from 'react';
import { pizzaDataService } from '../data-access/pizza-data-service';
import { PizzaCard, PizzaDisplay } from '../ui/PizzaCard';

export function PizzaListContainer() {
  const [pizzas, setPizzas] = useState<PizzaDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPizzas() {
      try {
        const data = await pizzaDataService.getPizzas();
        
        // Map from BFF's Pizza model to UI's PizzaDisplay interface
        const displayPizzas = data.map(pizza => ({
          name: pizza.name,
          price: pizza.price,
          imageUrl: pizza.imageUrl
        }));
        
        setPizzas(displayPizzas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pizzas');
      } finally {
        setLoading(false);
      }
    }

    loadPizzas();
  }, []);

  const handleAddToCart = (pizza: PizzaDisplay) => {
    // Handle business logic, potentially calling data service
    console.log('Adding to cart:', pizza);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pizza-list">
      {pizzas.map(pizza => (
        <PizzaCard
          key={pizza.name}
          pizza={pizza}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

</TabItem>
</Tabs>

Notice how the container component:
- Fetches data from the Data Access layer (`PizzaDataService`)
- Maps the BFF's full `Pizza` model to the UI's minimal `PizzaDisplay` interface
- Handles business logic and user interactions
- Passes only the necessary data to the presentational `PizzaCard` component

### Constraints
Libraries of the Implementation layer:
- May not have http calls or direct BFF communication.
- May only have container (smart) components.
- Must delegate HTML rendering to the UI layer.