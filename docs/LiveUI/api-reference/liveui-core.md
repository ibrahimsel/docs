---
id: liveui-core
title: LiveUI Core
sidebar_label: LiveUI Core
sidebar_position: 2
---

LiveUI Core is a library that produces the desired component for the desired framework-it's React and React Native for now- and registers the component in the main project.

### How Does LiveUI Core Work ?

LiveUI Core is a library where your component is mashed and a remote component is builded and produced instead.

With the InitializeApp function, remote operation happens using an existing default config file or a config file created by you. This remote operation register shared libraries and remotes inside of the configuration file. Then a remote component is built and produced with the help of this remote.

### Installation

    npm install @eclipse-muto/liveui-core

### How To Use LiveUI Core ?

In your projects, you have to import `liveui` from the LiveUI Core library. In initializeApp function, we use configuration file for remote. So if we want to make remote components, we have to import a config for remote. And giving this config into the liveui.initializeApp function will get a build of this config and produces the component.

    import liveui from '@eclipse-muto/liveui-core';

    import config from './liveui.config';
    
    liveui.initializeApp(config);

If you want to get a more information about liveui.config, [click here](/docs/LiveUI/explore).