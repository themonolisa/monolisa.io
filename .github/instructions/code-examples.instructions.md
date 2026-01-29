
---
applyTo: "docs/**/*.md"
---
# Code Examples

Guidelines when generating code examples or snippets for documentation.

## General Guidelines
- Frontend library folder convention: `libs/{Layer}/{FeatureName}`.
  - `Layer` here should be camelCase
- BFF library folder convention: `libs/server/{Layer}/{FeatureName}`.
  - `Layer` here should be camelCase.
- Purely backend library folder convention: `Libs/{Layer}/{FeatureName}`.
  - `Layer` here should be PascalCase.
- FeatureName is an actor's library.
  - For example, PizzaMenu is the actor when a user interacts with a pizza menu.
  - FeatureName in the Integration layer should be the name of the downstream service.
- Each code example should be in a library.

## Data models
- No DTO suffixes.

## TypeScript/JavaScript Guidelines
- A library is an Nx (the monorepo tool) library.
- Imports
  - Use Nx-style library imports when importing from another library.
  - Library import convention: `@my-company/{layer}/{feature-name}`.
    - `layer` should be camelCase.
    - `feature-name` should be kebab-case.
  - Don't use Nx-style imports when importing from inside the same library.

## .NET Guidelines
- Use C# and .NET best practices.
- A library is a .NET project.
- Library namespace convention: `MyCompany.{Layer}.{FeatureName}`.
  - `Layer` here should be PascalCase.