---
sidebar_position: 1
---

# Monorepo Practice

The 'Mono' of **Mono**LISA.

> A monorepo is a single git repository that holds the source code for multiple applications and libraries, along with the tooling for them.

Let's consider the elements of this [definition](https://nx.dev/concepts/decisions/why-monorepos).

## Libraries

Libraries (also known as modules or components) in MonoLISA represent features. It's where the logic or 'functionality' of features are written.

Place libraries in a dedicated folder, such as 'libs'.

## Applications

Applications in MonoLISA are the launch or deployment vehicles of libraries. They are shells (with little to no logic) that string (or bundle) libraries together for use. An executable is an example of an app.

Place apps in a dedicated folder, such as 'apps'.

In MonoLISA, libraries must be ignorant of apps. As a result, the libs folder may not be a subfolder of the apps folder, and vice versa. Also, libraries' source code may not depend on apps.

## Tooling

In MonoLISA, a specialized tool should be used to manage the monorepo. It should be clever enough only to validate (lint, unit test) and build (compile) the code that your changes affected.

## Monorepo in style

Many may picture a monorepo as a 'monolithic' repository with a ton of code. In MonoLISA, it doesn't have to be. It can be a monorepo in style rather than scope.

For example, you could use MonoLISA for a single application. The repo's apps folder would then contain one app.