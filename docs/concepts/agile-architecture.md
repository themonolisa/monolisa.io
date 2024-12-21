---
sidebar_position: 5
---

# Agile Architecture
The 'A' of MonoLIS**A**.

A Waterfall process has [Big Design Up Front (BDUF)](https://en.wikipedia.org/wiki/Big_design_up_front). Teams that practice BDUF make many significant design decisions upfront. For example, they may decide to have 𝓧 microservices before they start development and fashion their repos around that decision.

Agile has 'small design up front'. Just enough design decisions are made to kick off development, and the others are deferred to the iterations (sprints) in which they're needed. The design evolves or [emerges](https://ronjeffries.com/xprog/articles/emergent-design/) over the course of iterations.

MonoLISA has Agile architecture because of its synergy with Agile. The ignorace features (libraries) have of how they're deployed (apps) allows us to change our deployment model with minimal effort at any time. This allows us to start with a simple deployment model, to defer deployment decisions, and to pivot when needed.

For example, we could deploy our libraries as a [monolith first](https://martinfowler.com/bliki/MonolithFirst.html). After that, suppose we find it does not suffice. In that case, we can quickly pivot to microservices by adding an app for each microservice, plugging the relevant libraries into them, and launching them into infrastructure.
