---
sidebar_position: 2
---

# Layered Libraries

The 'L' of Mono**L**ISA.

MonoLISA achieves [separation of concerns (SoC)](https://en.wikipedia.org/wiki/Separation_of_concerns) with:

* Layers to separate technical concerns.
    
* Libraries to separate the concerns of actors.
    

## Layers

Define a layer for each high-level technical concern.

Domain (business rules), API (endpoints), database (repositories), and integration (to downstream services) are examples of backend layers.

Create a folder for each layer in the libs folder. For example:

```plaintext
libs
- domain
- api
- db
- integration
```

## Libraries

Create libraries for [actors](https://en.wikipedia.org/wiki/Actor_(UML)) within the layers.

### Actors

An actor is a role an entity plays when it interacts with the system. The entity may be a human or an external system.

For example, if you are developing an email app, the user could be seen as an ‘inbox viewer’ actor when they view the inbox and a ‘draft editor’ when they write an email.

```plaintext
libs
- domain (layer)
  - inbox (lib)
  - draft-editor (lib)
- api (layer)
  - inbox (lib)
  - draft-editor (lib)
etc.
```