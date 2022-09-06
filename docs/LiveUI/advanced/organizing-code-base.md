---
id: organizing-code-base
title: Organizing Your Code Base
sidebar_label: Organizing Your Code Base
sidebar_position: 1
---

This document is about the different uses of LiveUI Micro Frontend.

## What Are These Different Uses ?

The purpose of creating LiveUI is multiple. It has more than one use shaped according to these purposes.

### Single Code Base

Single Code Base is the use where the project is under a single code file. It is an approach that can be used if your project is relatively small, or if your project team does not need to be divided much.

In this use where the project is a single code base, you need to use more than one configuration file because the UI component you want to make live and where you want to use this component will be under the same project. 

More information about how to use this single code base in [React](single-codebase-react) and [React Native](single-codebase-react-native).

### Multiple Code Bases

Multiple Code Bases are a use for split projects where the project has multiple child projects. It is an approach that can be used if your project is relatively large, if the project teams will work separately in child projects, and if your child projects are compatible with other projects.

In this use, where the project is a multiple code bases, you need to use a configuration file in both the parent and child projects, since the UI component you want to make remote is in the child project, and where you want to use this component is in the main project. 

More information about how to use this multiple code bases in [React](multiple-codebases-react) and [React Native](multiple-codebases-react-native).

### Mixed Code Base

Mixed Code Base is a use for projects with components that will require you to use LiveUI MicroFrontend in both the parent project and the child project. It is an approach that can be used if your project is monolithic and you are starting to break up.

In this use, where the project is a mixed code base, the UI components you want to make remote are available in both the child project and the parent project. Since it is necessary to add this component to the main project, one configuration file is required in the child project and two configuration files are required in the main project.