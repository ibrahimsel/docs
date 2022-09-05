---
id: liveui
title: Muto LiveUI
sidebar_label: Muto LiveUI
sidebar_position:  10

---

## What is a Micro Frontend?

Micro frontends is an [architectural style where independently deliverable frontend applications are composed into a greater whole](https://martinfowler.com/articles/micro-frontends.html).  You can read an excellent writeup on micro front-ends and different approaches on how to implement them from [Cam Jackson](https://martinfowler.com/articles/micro-frontends.html).  We will repeat some of those important points here:

- ** Incremental upgrades: ** An imporant aspect of any application with a micro-service arhitecture is the ability to update parts of an application without being weighed down by the monolithic UI.  With a micro frontend architecture, you can make case-by-case decisions on which individual parts of an applications is a candidate to become a microfrontend, and incremental upgrades to our architecture, our dependencies, and our user experience.
- ** Simple, decoupled codebases: ** The source code for each individual micro frontend will by definition be much smaller than the source code of a single monolithic frontend. These smaller codebases tend to be simpler and easier for developers to work with.
- ** Independent deployment: ** Just as with microservices, independent deployability of micro frontends is key. This reduces the scope of any given deployment, which in turn reduces the associated risk. Regardless of how or where your frontend code is hosted, each micro frontend should have its own continuous delivery pipeline, which builds, tests and deploys it all the way to production.
- ** Autonomous teams: ** A benefit of decoupling both our codebases and our release cycles, we get a long way towards having fully independent teams, who can own a section of a product from ideation through to production and beyond. Teams can have full ownership of everything they need to deliver value to customers, which enables them to move quickly and effectively. 

![Each micro frontend is deployed to production independently (https://martinfowler.com/articles/micro-frontends.html)](https://martinfowler.com/articles/micro-frontends/deployment.png) *Figure from: https://martinfowler.com/articles/micro-frontends.html*
 

There are many different ways of building applications with micro frontends: These range from [server-side template composition](https://martinfowler.com/articles/micro-frontends.html#Server-sideTemplateComposition) methods (or if you want to go waaaay back, portals!), [build-time integration](https://martinfowler.com/articles/micro-frontends.html#Build-timeIntegration) that packages all "front-end" packages into a single bundle, [runtime integration with iframes](https://martinfowler.com/articles/micro-frontends.html#Run-timeIntegrationViaIframes), [oembed](https://oembed.com/) or [web components](https://martinfowler.com/articles/micro-frontends.html#Run-timeIntegrationViaWebComponents), each of which have some of the benefits we lsited above but also suffer serious [short comings](https://martinfowler.com/articles/micro-frontends.html#IntegrationApproaches) that we will not list here. 


---

## What is LiveUI?

LiveUI opts for [run-time integration via JavaScript](https://martinfowler.com/articles/micro-frontends.html#Run-timeIntegrationViaJavascript) that is tighly integrated with popular Javascipt frameworks such as [React.js](https://reactjs.org/), [Vue.js](https://vuejs.org/) and integrates well with packaging and development tools such as [npm](https://www.npmjs.com/), [Webpack](https://webpack.js.org/) and [Metro bundler](https://facebook.github.io/metro/).

There is a cost to using distributed, micro service based architecture; there are more pieces, more repositories, more tools, more build/deploy pipelines, more servers, more domains, etc. We created LiveUI to help us manage some of these issues and improve the developers' experience using micro frontends. Live UI can be fully configurable to be integrated into many different devops processes and pipelines allowing many different custom project and repository layouts, test and quality tools. Development tooling and debugging experience is seamless with or without the inclusion of the container (parent) frontend.

- ** Developer Tools : ** LiveUI provides a set of tools that can be integrated into any Javascript project and allows you to easily add, update, organize and debug micro frontends with new and existing projects. It supports zero-configuration for ease of use and fully customizable configurations for advanced use cases.
- ** Debugging and Hot Reloads : ** The micro front end projeects can be debugged indepently or within the parent application. Hot reloading of micro frontend during development and editing is supported via native integration with Webpack or Metro bundler.
- ** Core Library: ** A very small runtime library (less than 4k) that is bundled with the container application that deals with micro front-end runtime integration and life-cycle tasks
- ** Framework Plugin: ** A small plugin that complements the core library for React.js, Vue.js and for other similar popular frameworks in the future.

---

## Where to start?

You can jump to the [quick start](getting-started/getting-started-react) section to get started with LiveUI. If you want to see some examples, check our  [samples repository](https://gitlab.eteration.com/eteration/labs/composiv/liveui-samples "samples").
