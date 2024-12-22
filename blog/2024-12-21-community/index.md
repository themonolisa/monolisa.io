---
slug: community
title: Community
authors: [chris]
---
A design pattern is a standard (named) solution to a common software design problem. It's like an [opening](https://en.wikipedia.org/wiki/Chess_opening) in chess. The French Defense, for example, is a standard solution for the problem of [e4](https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._e4). MonoLISA is a new design pattern in the sense that it's a named solution to the common problem of repositories needing to change often.


### Background
My peers and I worked with a plethora of repositories (polyrepos) in 2019. Some of us entertained the idea of monorepos. In 2020, we started playing with [Nx](https://nx.dev) monorepos. We found it made our development much more efficient. As a result, we decided to double down and pivot to monorepos.

### Clean Code
Some of our old polyrepos had crufty code. We drew from [Uncle Bob's](https://en.wikipedia.org/wiki/Robert_C._Martin) teachings on [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) to figure out a cleaner way to write code in our monorepo. After months of experimentation and discussion, we ended up with what we referred to as 'our architecture'.

It separated the concerns of our code in a way that made it easy to understand, change, and unit test. And it made us more agile because it gave us options and kept them [open](https://blog.cleancoder.com/uncle-bob/2014/10/01/CleanMicroserviceArchitecture.html).

### Finding a name
We realised that 'our architecture' could empower other software engineering teams. How cool would it be if others also used it?! But continuing to call it that would undermine the vision of others using it. It needed a name!

I like how the [SOLID](https://en.wikipedia.org/wiki/SOLID) principles have a mnemonic as a name. I considered the bits of 'our architecture' to see if they could form a mnemonic. MonoLISA then came to me as I obsessed over it at home on a winter's evening in 2023.

A name that sounds like the [Mona Lisa](https://en.wikipedia.org/wiki/Mona_Lisa) is catchy! Leonardo Da Vinci is one of the most famous engineers in history. It's apt for software engineers to give a similar name to their creation about 500 years later.

I suggested the name the next day. The team loved it.
We found a name with the potential to give it wings!

### Getting it out there

A MonoLISA [article](https://chrisfouche.com/monolisa) was published on my blog earlier this year to start getting it out there.

This website (monolisa.io) is the next move towards a MonoLISA community. It's a space where open-minded individuals can learn about and discuss MonoLISA.

### Conclusion
MonoLISA is a design pattern that cultivates repositories for continuous change. It's the art of crafting clean repositories. We drew its outlines. May an international community (perhaps including you) colour it in and give it texture. Let's find out if 'she' has what it takes to become a software influencer!