---
id: zero-configuration
title: Zero Configuration
sidebar_label: Zero Configuration
sidebar_position: 1
---

The simplest way to get started with LiveUI is using the CLI tool called `liveui` which can create projects with zero configuration. With CLI tool you have no configuration or complicated folder structures are created, only the files you need to build your app are added.

First, install the CLI tool globally:

    npm i @eclipse-muto/liveui -g

Then create a new LiveUI project with following command:

    liveui create

> `npx @eclipse-muto/liveui` or `npx @eclipse-muto/liveui create` can be run for the same purpose.

This command's output is as follows. 

![LiveUI create](/img/liveui-create.png)

There are two options: React and React Native (Vue and NativeScript support will be ready soon!). Choose one and type a project name. After typing the project name, the required packages will be installed and the instructions will be displayed to the project type you selected.