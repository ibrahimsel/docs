---
id: single-codebase-react-native
title: Single Codebase For React Native
sidebar_label: Single Codebase For React Native
sidebar_position: 2
---

In this section, we will describe how to integrate LiveUI with your project that is currently running or developing. 

Let's assume we have a project structure like follows:
```
simple-react-native-app
├── App.js
├── __tests__
├── android
├── app.json
├── babel.config.js
├── components
│   ├── Header.js
│   └── Footer.js
├── index.js
├── ios
├── metro.config.js
└── package.json
```

`index.js` file:
```js title="index.js"
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

`App.js` file:
```js title="App.js"
import React from 'react';
import {View} from 'react-native';

import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <View>
      <Header title="Hello World!" />
      <Footer />
    </View>
  );
};
```

`Header.js` file:
```js title="components/Header.js"
import React from 'react';
import {Text,View} from 'react-native';

function Header(props) {
  const { title } = props;

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

export default Header;
```
## Start to configure for remote components 

Firstly, we need to install some packages to our project for using LiveUI properly. 

```sh
npm i --save-dev babel-loader css-loader file-loader html-loader image-webpack-loader style-loader svg-url-loader url-loader
```

Then we need to create a LiveUI configuration file for making components remotable. You can use __liveui init__ for this action.

```sh
liveui init
```

> You should run this command on the project's root folder. Otherwise, you need to pass __--config__ parameter with your config path while you start serving remote components.

After creating the configuration file you can start editing options according to your needs.

```js title="liveui.config.js"
module.exports = {
    shared: ['react', 'react-native'],
    exposes: {
        header: './components/Header.js',
    },
    microPort: 5001,
    hotReloadContext: 'components',
}
```

__[`shared`](/docs/LiveUI/explore#shared):__ You need to define this option with some modules like libraries, components, classes, etc. In this way, remote components will try to get these values from the environment in which they run. You can think these values are shared by the host application that we will explain in the next section.

> `host` is the application that consumes remote components.

__[`exposes`](/docs/LiveUI/explore#exposes):__ Then you need to specify component names and paths as key-value pairs that will be used as remotes on this  option. The name of the component is important because of the remote component will be served using this name.

__[`microPort`](/docs/LiveUI/explore#microPort):__ In development, you can define a port that is responsible for serving your remote components.

__[`hotReloadContext`](/docs/LiveUI/explore#microPort):__ The value you defined here helps LiveUI for hot module replacement on the host application in development.

Our configuration is complete. Let's try to run and serve our components as a remote component.

```sh
npx liveui start-native
```

When you run this command, LiveUI reads the config and serve the components we specified.

You can check your components at:

```
http://localhost:5001/header
```

> Also you can see the information page at http://localhost:5001

## Consuming Remote Components

Let's start consuming remote components. 

Install the packages that are responsible for initializing LiveUI app and consuming remote components. 

```sh
npm i @eclipse-muto/liveui-core @eclipse-muto/liveui-react-native
```

Then we need to create a config that contains shared modules and remote components URLs. You can use __liveui init__ command. 

```js title="liveui.config.host.js"
module.exports = {
    shares: {
        react: require('react'),
        'react-native': require('react-native'),
    },
    remotes: {
        header: 'http://localhost:5001/header',
    }
}
```
__[`shared`](/docs/LiveUI/explore#shares):__ As we described above, we define modules that are used by remote components.

__[`remotes`](/docs/LiveUI/explore#remotes):__ Define your component names and URLs. 

The next step is initializing our LiveUI host config.

Import `@eclipse-muto/liveui-core` and the host config in the `index.js` file

```js title="index.js"
import {AppRegistry} from 'react-native';
import liveui from '@eclipse-muto/liveui-core';
import App from './App';
import {name as appName} from './app.json';
import config from './liveui.config.host';

liveui.initializeApp(config);

AppRegistry.registerComponent(appName, () => App);
```

Import required `RemoteComponent` within `App.js` file:

```js title="App.js"
import React from 'react';
import {View} from 'react-native';
import RemoteComponent from '@eclipse-muto/liveui-react';

import Footer from './components/Footer';

const Header = props => <RemoteComponent name="Header" {...props} />;

const App = () => {
  return (
    <View>
      <Header title="Hello World!" />
      <Footer />
    </View>
  );
};

export default App;
```

We use RemoteComponent as a traditional component in React. We define `name` prop to tell RemoteComponent which component will be used on the host config. Also, you can define `url` prop directly without defining the remote component name.

```js
const Header = props => <RemoteComponent url="http://localhost:5001/Header" {...props} />;
```

We changed our monolith frontend app to micro frontend app with LiveUI on the same codebase. For more examples check our [samples repository](https://github.com/composiv/liveui-samples).