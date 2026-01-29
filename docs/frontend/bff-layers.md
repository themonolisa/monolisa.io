---
sidebar_position: 3
title: BFF Layers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# BFF Layers

Let's explore how to layer (the L of Mono**L**ISA) backends for frontends (BFFs).

Battle-tested layers for BFF applications:
* **API**
* **Integration**
* **Services**

## API layer

The API Layer provides the backend endpoints that the frontend communicates with.

It exposes HTTP endpoints the Data Access layer (of the frontend) calls.

### Example

Here's an example of the API layer:

<Tabs groupId="backend">
<TabItem value="dotnet" label=".NET">

```csharp
// libs/server/api/PizzaMenu/Program.cs
using Microsoft.AspNetCore.Mvc;
using MyCompany.Services.PizzaMenu;
using MyCompany.Services.PizzaMenu.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IPizzaService, PizzaService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/api/pizzas", async (IPizzaService pizzaService) =>
{
    var pizzas = await pizzaService.GetPizzasAsync();
    return Results.Ok(pizzas);
})
    .WithName("GetPizzas")
    .WithOpenApi();

app.MapGet("/api/pizzas/{id}", async (string id, IPizzaService pizzaService) =>
{
    var pizza = await pizzaService.GetPizzaByIdAsync(id);
    return pizza is not null ? Results.Ok(pizza) : Results.NotFound();
})
    .WithName("GetPizzaById")
    .WithOpenApi();

app.MapPatch("/api/pizzas/{id}", async (
    string id, 
    [FromBody] UpdatePizzaRequest request,
    IPizzaService pizzaService) =>
{
    var pizza = await pizzaService.UpdatePizzaAsync(id, request);
    return pizza is not null ? Results.Ok(pizza) : Results.NotFound();
})
    .WithName("UpdatePizza")
    .WithOpenApi();

app.Run();
```

</TabItem>
<TabItem value="nestjs" label="NestJS">

```typescript
// libs/server/api/pizzaMenu/controllers/pizza.controller.ts
import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { PizzaService, Pizza, UpdatePizza } from '@my-company/services/pizza-menu';

@Controller('api/pizzas')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Get()
  async findAll(): Promise<Pizza[]> {
    return this.pizzaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pizza> {
    return this.pizzaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePizza: UpdatePizza,
  ): Promise<Pizza> {
    return this.pizzaService.update(id, updatePizza);
  }
}
```

</TabItem>
</Tabs>

Notice how the API layer:
- Exposes REST endpoints that match the Data Access layer's expectations.
- Delegates behaviour to the Services layer.

### Constraints
The API layer:
- May only have endpoints and controllers.
- May only depend on the Services layer.


## Integration layer

The integration layer is used to integrate with downstream services. It contains services or functions that call downstream APIs.

### Example

Here's an example of the Integration layer calling a downstream API (called 'DownstreamPizzas'):

<Tabs groupId="backend">
<TabItem value="dotnet" label=".NET">

```csharp
// libs/server/integration/DownstreamPizzas/IPizzaIntegrationService.cs
namespace MyCompany.Integration.DownstreamPizzas;

using MyCompany.Integration.DownstreamPizzas.Models;

public interface IPizzaIntegrationService
{
    Task<IEnumerable<DownstreamPizza>> GetPizzasAsync();
    Task<DownstreamPizza?> GetPizzaByIdAsync(string id);
    Task<DownstreamPizza?> UpdatePizzaAsync(string id, DownstreamUpdatePizzaRequest request);
}

// libs/server/integration/DownstreamPizzas/PizzaIntegrationService.cs
namespace MyCompany.Integration.DownstreamPizzas;

using System.Text;
using System.Text.Json;
using MyCompany.Integration.DownstreamPizzas.Models;

public class PizzaIntegrationService : IPizzaIntegrationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PizzaIntegrationService> _logger;

    public PizzaIntegrationService(
        HttpClient httpClient,
        ILogger<PizzaIntegrationService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<IEnumerable<DownstreamPizza>> GetPizzasAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("api/pizzas");
            response.EnsureSuccessStatusCode();
            
            var pizzas = await response.Content.ReadFromJsonAsync<IEnumerable<DownstreamPizza>>();
            return pizzas ?? Enumerable.Empty<DownstreamPizza>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to fetch pizzas from DownstreamPizzas");
            throw;
        }
    }

    public async Task<DownstreamPizza?> GetPizzaByIdAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"api/pizzas/{id}");
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
            
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<DownstreamPizza>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to fetch pizza {PizzaId} from DownstreamPizzas", id);
            throw;
        }
    }

    public async Task<DownstreamPizza?> UpdatePizzaAsync(
        string id, 
        DownstreamUpdatePizzaRequest request)
    {
        try
        {
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PatchAsync(
                $"api/pizzas/{id}", 
                content);
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
            
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<DownstreamPizza>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to update pizza {PizzaId} in DownstreamPizzas", id);
            throw;
        }
    }
}

// libs/server/integration/DownstreamPizzas/Models/DownstreamPizza.cs
namespace MyCompany.Integration.DownstreamPizzas.Models;

public record DownstreamPizza(
    string Id,
    string Name,
    decimal Price,
    string ImageUrl,
    string[] Ingredients,
    string Description,
    bool IsVegetarian
);

// libs/server/integration/DownstreamPizzas/Models/DownstreamUpdatePizzaRequest.cs
namespace MyCompany.Integration.DownstreamPizzas.Models;

public record DownstreamUpdatePizzaRequest(
    string? Name,
    decimal? Price,
    string? ImageUrl,
    string[]? Ingredients,
    string? Description,
    bool? IsVegetarian
);
```

</TabItem>
<TabItem value="nestjs" label="NestJS">

```typescript
// libs/server/integration/downstreamPizzas/pizza-integration.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DownstreamPizza, DownstreamUpdatePizza } from './models';

@Injectable()
export class PizzaIntegrationService {
  private readonly logger = new Logger(PizzaIntegrationService.name);
  private readonly baseUrl = 'api/pizzas';

  constructor(private readonly httpService: HttpService) {}

  async getPizzas(): Promise<DownstreamPizza[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<DownstreamPizza[]>(this.baseUrl),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch pizzas from DownstreamPizzas', error);
      throw error;
    }
  }

  async getPizzaById(id: string): Promise<DownstreamPizza> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<DownstreamPizza>(`${this.baseUrl}/${id}`),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Pizza with ID ${id} not found`);
      }
      this.logger.error(
        `Failed to fetch pizza ${id} from DownstreamPizzas`,
        error,
      );
      throw error;
    }
  }

  async updatePizza(
    id: string,
    updatePizza: DownstreamUpdatePizza,
  ): Promise<DownstreamPizza> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch<DownstreamPizza>(`${this.baseUrl}/${id}`, updatePizza),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Pizza with ID ${id} not found`);
      }
      this.logger.error(
        `Failed to update pizza ${id} in DownstreamPizzas`,
        error,
      );
      throw error;
    }
  }
}

// libs/server/integration/downstreamPizzas/models/downstream-pizza.entity.ts
export interface DownstreamPizza {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  description: string;
  isVegetarian: boolean;
}

// libs/server/integration/downstreamPizzas/models/downstream-update-pizza.ts
export interface DownstreamUpdatePizza {
  name?: string;
  price?: number;
  imageUrl?: string;
  ingredients?: string[];
  description?: string;
  isVegetarian?: boolean;
}
```

</TabItem>
</Tabs>

Notice how the Integration layer:
- Handles all HTTP communication with the downstream DownstreamPizzas.
- Isolates downstream-service details from the rest of the BFF.

### Databases
We don’t recommend that BFFs interface with databases. They should integrate with downstream services that talk to databases.

### Constraints
- May not depend on other layers.
- Each library in the Integration layer may only call one downstream service.

## Services layer

The Services layer orchestrates data flow between the API and Integration layers. It contains services or functions the API layer calls to fulfill requests.

### Business rules
The Services layer contains business rules specific to the BFF. For example, if the BFF needs to combine data from multiple downstream services, that logic belongs here.

### Example

Here's an example of the Services layer:

<Tabs groupId="backend">
<TabItem value="dotnet" label=".NET">

```csharp
// libs/server/services/PizzaMenu/IPizzaService.cs
namespace MyCompany.Services.PizzaMenu;

using MyCompany.Services.PizzaMenu.Models;

public interface IPizzaService
{
    Task<IEnumerable<Pizza>> GetPizzasAsync();
    Task<Pizza?> GetPizzaByIdAsync(string id);
    Task<Pizza?> UpdatePizzaAsync(string id, UpdatePizzaRequest request);
}

// libs/server/services/PizzaMenu/PizzaService.cs
namespace MyCompany.Services.PizzaMenu;

using MyCompany.Services.PizzaMenu.Models;
using MyCompany.Integration.DownstreamPizzas;
using MyCompany.Integration.DownstreamPizzas.Models;

public class PizzaService : IPizzaService
{
    private readonly IPizzaIntegrationService _integrationService;

    public PizzaService(IPizzaIntegrationService integrationService)
    {
        _integrationService = integrationService;
    }

    public async Task<IEnumerable<Pizza>> GetPizzasAsync()
    {
        // Fetch from downstream service
        var downstreamPizzas = await _integrationService.GetPizzasAsync();
        
        // Map from Integration layer models to Services layer models
        var pizzas = downstreamPizzas.Select(dp => new Pizza(
            dp.Id,
            dp.Name,
            dp.Price,
            dp.ImageUrl,
            dp.Ingredients,
            dp.Description,
            dp.IsVegetarian
        ));
        
        // Apply any BFF-specific business logic here
        // For example: filtering, sorting, combining data from multiple sources
        
        return pizzas;
    }

    public async Task<Pizza?> GetPizzaByIdAsync(string id)
    {
        var downstreamPizza = await _integrationService.GetPizzaByIdAsync(id);
        
        if (downstreamPizza is null)
        {
            return null;
        }
        
        // Map from Integration layer model to Services layer model
        var pizza = new Pizza(
            downstreamPizza.Id,
            downstreamPizza.Name,
            downstreamPizza.Price,
            downstreamPizza.ImageUrl,
            downstreamPizza.Ingredients,
            downstreamPizza.Description,
            downstreamPizza.IsVegetarian
        );
        
        // Apply any BFF-specific transformations or enrichment
        
        return pizza;
    }

    public async Task<Pizza?> UpdatePizzaAsync(string id, UpdatePizzaRequest request)
    {
        // Apply any BFF-specific validation or business rules
        
        // Map from Services layer model to Integration layer model
        var downstreamRequest = new DownstreamUpdatePizzaRequest(
            request.Name,
            request.Price,
            request.ImageUrl,
            request.Ingredients,
            request.Description,
            request.IsVegetarian
        );
        
        var downstreamPizza = await _integrationService.UpdatePizzaAsync(id, downstreamRequest);
        
        if (downstreamPizza is null)
        {
            return null;
        }
        
        // Map from Integration layer model to Services layer model
        return new Pizza(
            downstreamPizza.Id,
            downstreamPizza.Name,
            downstreamPizza.Price,
            downstreamPizza.ImageUrl,
            downstreamPizza.Ingredients,
            downstreamPizza.Description,
            downstreamPizza.IsVegetarian
        );
    }
}

// libs/server/services/PizzaMenu/Models/Pizza.cs
namespace MyCompany.Services.PizzaMenu.Models;

public record Pizza(
    string Id,
    string Name,
    decimal Price,
    string ImageUrl,
    string[] Ingredients,
    string Description,
    bool IsVegetarian
);

// libs/server/services/PizzaMenu/Models/UpdatePizzaRequest.cs
namespace MyCompany.Services.PizzaMenu.Models;

public record UpdatePizzaRequest(
    string? Name,
    decimal? Price,
    string? ImageUrl,
    string[]? Ingredients,
    string? Description,
    bool? IsVegetarian
);
```

</TabItem>
<TabItem value="nestjs" label="NestJS">

```typescript
// libs/server/services/pizzaMenu/pizza.service.ts
import { Injectable } from '@nestjs/common';
import { PizzaIntegrationService } from '@my-company/integration/downstream-pizzas';
import { Pizza, UpdatePizza } from './models';

@Injectable()
export class PizzaService {
  constructor(
    private readonly pizzaIntegrationService: PizzaIntegrationService,
  ) {}

  async findAll(): Promise<Pizza[]> {
    // Fetch from downstream service
    const downstreamPizzas = await this.pizzaIntegrationService.getPizzas();
    
    // Map from Integration layer models to Services layer models
    const pizzas: Pizza[] = downstreamPizzas.map(dp => ({
      id: dp.id,
      name: dp.name,
      price: dp.price,
      imageUrl: dp.imageUrl,
      ingredients: dp.ingredients,
      description: dp.description,
      isVegetarian: dp.isVegetarian,
    }));
    
    // Apply any BFF-specific business logic here
    // For example: filtering, sorting, combining data from multiple sources
    
    return pizzas;
  }

  async findOne(id: string): Promise<Pizza> {
    const downstreamPizza = await this.pizzaIntegrationService.getPizzaById(id);
    
    // Map from Integration layer model to Services layer model
    const pizza: Pizza = {
      id: downstreamPizza.id,
      name: downstreamPizza.name,
      price: downstreamPizza.price,
      imageUrl: downstreamPizza.imageUrl,
      ingredients: downstreamPizza.ingredients,
      description: downstreamPizza.description,
      isVegetarian: downstreamPizza.isVegetarian,
    };
    
    // Apply any BFF-specific transformations or enrichment
    
    return pizza;
  }

  async update(id: string, updatePizza: UpdatePizza): Promise<Pizza> {
    // Apply any BFF-specific validation or business rules
    
    // Map from Services layer model to Integration layer model
    const downstreamUpdate = {
      name: updatePizza.name,
      price: updatePizza.price,
      imageUrl: updatePizza.imageUrl,
      ingredients: updatePizza.ingredients,
      description: updatePizza.description,
      isVegetarian: updatePizza.isVegetarian,
    };
    
    const downstreamPizza = await this.pizzaIntegrationService.updatePizza(
      id,
      downstreamUpdate,
    );
    
    // Map from Integration layer model to Services layer model
    return {
      id: downstreamPizza.id,
      name: downstreamPizza.name,
      price: downstreamPizza.price,
      imageUrl: downstreamPizza.imageUrl,
      ingredients: downstreamPizza.ingredients,
      description: downstreamPizza.description,
      isVegetarian: downstreamPizza.isVegetarian,
    };
  }
}

// libs/server/services/pizzaMenu/models/pizza.entity.ts
export interface Pizza {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  description: string;
  isVegetarian: boolean;
}

// libs/server/services/pizzaMenu/models/update-pizza.ts
import { IsString, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePizza {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  ingredients?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean;
}

// libs/server/services/pizzaMenu/models/index.ts
export * from './pizza.entity';
export * from './update-pizza';
```

</TabItem>
</Tabs>

Notice how the Services layer:
- Delegates integration with downstream services to the Integration layer.
- Contains business logic specific to the BFF.
- Can combine or transform data from multiple sources.

### Constraints
The Services layer:
- May only depend on the Integration layer.
- May not make HTTP calls directly (delegates to Integration layer).