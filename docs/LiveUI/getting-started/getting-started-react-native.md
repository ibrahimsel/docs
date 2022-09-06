---
id: getting-started-react-native
title: React Native
sidebar_label: React Native
---

In this section, we will quickly describe how to start using LiveUI with a React Native mobile application.

> If you are interested in React Web apps, you can [go to the react ](getting-started-react) section.

### Prerequisites

- [node >= 8](https://nodejs.org/en/download/ "Heading link")<br/>
- [npm >= 5](https://www.npmjs.com/get-npm/ "Heading link")<br/>

## Creating an App

First, we need to install `liveui` wizard to create a new LiveUI app. To install the new package, use one of the following commands. You need administrator privileges to execute these unless npm was installed on your system through a Node.js version manager (e.g. n or nvm).

```sh
npm install @eclipse-muto/liveui -g
```

After installation, you will have access to the `liveui` binary in your command line. You can verify that it is properly installed by simply running `liveui`, which should present you with a help message listing all available commands.

> `npx @eclipse-muto/liveui` can be run for the same purpose.

To create a new LiveUI app with remotable components, you may choose one of the following methods:

```sh
liveui
```

or

```sh
liveui create
```

This prompt runs the LiveUI project wizard and will ask a project type and a project name. For this example, choose the project type as `react-native` and follow the wizard instructions. The wizard will generate your project and start to install the required packages. When it's done you can start to develop your first LiveUI project.  This project will contain a component that can be consumed by other web apps.

Once the installation is done, you can open your project folder:

    cd <project-name>

The initial project structure:
```
your-liveui-native-app
│
├── README.md
├── __tests__
├── android
├── app.json
├── babel.config.js
├── index.js
├── ios
├── metro.config.js
├── node_modules
├── package-lock.json
├── package.json
└── src
    └── index.js
```
No configuration or complicated folder structures are created, only the files you need to build your app are added. To start the application run __npm run ios__ or __npm run android__ inside your React Native project folder:

On IOS:
```sh
npx pod-install
npm run ios
```
On Android:
```sh
npm run android     
```

Inside the newly created project, you can run some built-in commands:

### __`npm start`__

Runs the app in development mode and serve the initial remote component. 

When you start the application open to view it in the emulator. You will see just a basic component that displays 'This is the Foo component..'. This application is no different from a traditional React Native application. However, LiveUI has added a [`remote`](../explore#remotes) configuration for component that is running on [`http://localhost:5001/foo`](http://localhost:5001/foo) and it is ready to be used in other React Native applications for development or deployment. Edit `src/index.js` to change the initial remote component and see the browser to view your changes.


### __`npm run build`__

Builds the remote component(s) for production to the `docker` folder.
It correctly bundles the remote component in production mode and optimizes the build for the best performance.

> Note: This command is only responsible for building the remote component(s) not the whole application.

Your component is ready to be deployed.

At this point you can run `npm run docker` to generate a docker image.

In the next steps, you will learn more about how to use remote components.

## Using Remote Components

In the previous sections we demonstrated how to create and run a basic LiveUI project that contains a remote component. In this section we will demonstrate how to consume these remote component(s) in a host application.

First we need an application (called host) to make use of our remote components. For the simplicity we will use [react-native init](https://github.com/facebook/react-native) to create a React Native project.

    npx react-native init myapp
    cd myapp

After creating the project we will add the liveui npm packages to use remote components.

    npm install @eclipse-muto/liveui-core @eclipse-muto/liveui-react-native

> These packages are responsible for initializing LiveUI configuration and consuming components that are running locally or remotely.

Next, we will create a file that is used to configure the host.

Create a liveui.config.js file under the project folder with the following command:

```sh
liveui init
```

The command above will create a config file with the following content:

```js title="appDir/liveui.config.js"
module.exports = {
    // ...
    // other configuration options
    shares: {
        react: require('react'),
        'react-native': require('react-native'),
    },
    remotes: {
        foo: 'http://localhost:5001/foo',
    }
}
```

In the above config, we define the [`shares`](../explore#shares) configuration option to tell what libraries, packages, components, or static files will be commonly used between the host application and [`remotes`](../explore#remotes).  This will optimize the bundles that are used in runtime by avoiding duplications of libraries in the host and remote packages.

The [`remotes`](../explore#remotes) option is where we specify the name and URL of our component. If you remember, in the previous section when we start the application the remote component was running on [http://localhost:5001/foo](http://localhost:5001/foo).

Open `index.js` under the project folder and edit to initialize the config:

```diff title="src/index.js"
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

+ import liveui from '@eclipse-muto/liveui-core';
+ import config from './liveui.config';

+ liveui.initializeApp(config);

AppRegistry.registerComponent(appName, () => App);
```

Open `App.js` and edit it as follows:

```diff title="src/App.js"
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
+ import RemoteComponent from '@eclipse-muto/liveui-react-native';

+ const Foo = () => <RemoteComponent name="foo" />;

const App: () => React$Node = () => {
  return (
    <SafeAreaView>
+      <Foo />
    </SafeAreaView>
  );
};

export default App;
```

We have define our remote component as follows:

```js
const Foo = props =>  <RemoteComponent name="foo" {...props} />
```

> The value of the 'name'  should be the same as the name we defined in the config file for the remote component.

Save changes and start the application. At the same time you should start the LiveUI app created in the previous section to see our first remote component.

That's it! You created your first LiveUI Mobile App. But there’s more! You can use different styles to organize your codebase,  customizing the liveui.config allows you to use working with different codebases, deployment of multiple components, etc.  Read to learn more about LiveUI and explore the documentation!