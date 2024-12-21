---
sidebar_position: 3
---

# Interface Segregation
The 'I' of MonoL**I**SA.

The idea of the [Interface Segregation Principle (ISP)](https://en.wikipedia.org/wiki/Interface_segregation_principle) is for your code to know as little as possible. In particular, it says a source-code construct should not depend on (use) interfaces with more members than it needs.

Imagine a class that only needs a client's first and last names as a source-code construct that must follow the ISP.

The following violates the principle, because Client has unneeded members:

```typescript
interface Client {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

class ClientDetailsService {
  generateFullName(client: Client) {
    return `${client.firstName} ${client.lastName}`;
  }
}
```

The following honours it:

```typescript
interface Client {
  firstName: string;
  lastName: string;
}

class ClientDetailsService {
  generateFullName(client: Client) {
    return `${client.firstName} ${client.lastName}`;
  }
}
```

In MonoLISA, a library is the source-code construct that may not depend on interfaces with unneeded members. The interfaces used by that library must be defined within it. That means whatever depends on (uses) that library will need to map to its interfaces.

The libraries of at least one layer in MonoLISA must adhere to the ISP.