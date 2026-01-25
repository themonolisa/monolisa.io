---
sidebar_position: 1
title: Overview
---

# Frontend Overview

MonoLISA enables you to craft clean frontend repos. In particular, repos with frontend applications and the backends for those frontends (BFFs).

## Frontends

A frontend application is a client-side application that:
- Runs on a user’s device (browser, phone, desktop, TV, etc.).
- Renders the user interface (UI).

## Backends for frontends (BFFs)
A backend for a frontend (BFF) is a backend service (API) dedicated to serving the needs of a frontend application. It acts as a proxy between the frontend and various backend services.

### Benefits
- Simplifies the frontend by only requiring it to auth with one backend.
- Reduces the number of requests the frontend needs to make.
- Speeds up requests by tailoring responses for the frontend's needs.