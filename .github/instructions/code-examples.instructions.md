
---
applyTo: "docs/**/*.md"
---
# Code Examples

Guidelines when generating code examples or snippets for documentation.

## Libraries
- 'Libs' for short.
- Also known as modules.
- Represent features.
- Place the logic or 'functionality' of features in libs.

## Applications
- 'Apps' for short.
- Apps are the deployment vehicles of libraries.
- Apps wire libraries together for use and set runtime configuration.
- Apps are deployed to infrastructure.
- Do not write feature 'functionality' in apps.

## Layered Libraries
- Separate technical concerns with layers.
- Within each layer, separate the concerns of actors with libs.
- An actor is the role an entity (human or system) plays when interacting with the system.
  - For example, 'PizzaMenu' viewer is the actor when a user interacts with a pizza menu.
- Each lib must have a single responsibility.
  - A responsibility is defined as the needs of an actor.
  - Each lib must serve a single actor.

## Frontend and BFF repos
For repos with frontend and BFF code:
- Create a `libs/{Layer}/{FeatureName}` folder for each frontend library.
- Create a `libs/server/{Layer}/{FeatureName}` for each BFF library.
- `Layer` and `FeatureName` should be camelCase.
- `FeatureName` should describe the library's actor.
  - One exception: Make `libs/server/integration/{FeatureName}` the name of the downstream service.

## Backend .NET repos
For backend repos with only .NET code:
- Create a `src/Libs/{Layer}/{FeatureName}` folder for each library.
- `Layer` and `FeatureName` should be PascalCase.
- `FeatureName` should describe the library's actor.
  - One exception: Make `src/Libs/Integration/{FeatureName}` the name of the downstream service.

## Data models
- No DTO suffixes.

## TypeScript/JavaScript Guidelines
- Use Nx (the monorepo tool) libraries.
- Follow this import style:
  - Use Nx-style library imports when importing from another library.
  - Library import convention: `@my-company/{layer}/{feature-name}`.
    - `layer` should be camelCase.
    - `feature-name` should be kebab-case.
  - Use relative imports when importing from inside the same library.

## .NET Guidelines
- Use C# and .NET best practices.
- A library is a .NET project.
- Library namespace convention: `MyCompany.{Layer}.{FeatureName}`.
  - `Layer` here should be PascalCase.