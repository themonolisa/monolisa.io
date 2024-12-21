---
sidebar_position: 4
---

# Single Responsibilities

The 'S' of MonoLI**S**A.

In MonoLISA, each library must adhere to the [Single Responsibility Principle (SRP)](https://en.wikipedia.org/wiki/Single-responsibility_principle).

The SRP says a library must have a single responsibility and defines responsibility as the needs of an actor. In other words, each library may only serve a single actor.

The email-app example under the 'Actors' section earlier adheres to the SRP because it has libraries for the 'inbox' and 'draft editor' actors. Without the SRP, an engineer may have created an 'email' library with both responsibilities.