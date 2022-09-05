---
id: getting-started-react
title: React
sidebar_label: React
sidebar_position: 2
---

In this section, we will quickly describe how to start using LiveUI with a React Web application.

> If you are interested in React Native you can [skip to the react native](getting-started-react-native) section.

### Prerequisites

- [node >= 8](https://nodejs.org/en/download/ "Heading link")<br/>
- [npm >= 5](https://www.npmjs.com/get-npm/ "Heading link")<br/>

## Creating an App with Remotable Components

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

This prompt runs the LiveUI project wizard and will ask a project type and a project name. For this example, choose the project type as `react` and follow the wizard instructions. The wizard will generate your project and start to install the required packages. When it's done you can start to develop your first LiveUI project.  This project will contain a component that can be consumed by other web apps.

Once the installation is done, you can open your project folder:

    cd <project-name>

The initial project structure:
```
your-liveui-app
│
├── README.md
├── internals
│   └── index.js
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── src
    └── index.js
```
No configuration or complicated folder structures are created, only the files you need to build your app are added.

Inside the newly created project, you can now run the following commands:

### __`npm start`__

Runs the app in development mode and serve the initial remote component. 

<!-- > **A remote:** another build, where part of it is being consumed by a “host” -->

When you start the application open [`http://localhost:5000`](http://localhost:5000) to test your new app in the browser. You will see just a basic component that displays 'This is the Foo component..'. This application is no different from a traditional React application. However, LiveUI has added a [`remote`](/docs/LiveUI/explore#remotes) configuration for component that is running on [`http://localhost:5001`](http://localhost:5001) and it is ready to be used in other React applications for development or deployment. Edit `src/index.js` to change the initial remote component and see the browser to view your changes.

### __`npm run build`__

Builds the remote component(s) for production to the `docker` folder.
It correctly bundles the remote component in production mode and optimizes the build for the best performance.

> Note: This command is only responsible for building the remote component(s) not the whole application.

Your remote component is ready to be deployed.

At this point you can run `npm run docker` to generate a docker image.

In the next steps, you will learn more about how to use remote components. 

## Using Remote Components

In the previous sections we demonstrated how to create and run a basic LiveUI project that contains a remote component. In this section we will demonstrate how to consume these remote component(s).

First we need an application (called host) to make use of our remote components. For the simplicity we will use [create-react-app](https://github.com/facebook/create-react-app) to create a React project.

    npx create-react-app my-app
    cd my-app

After creating the project we should use some npm packages to use remote components.

    npm install @eclipse-muto/liveui-core @eclipse-muto/liveui-react

> These packages are responsible for initializing LiveUI in the host app and consuming components that are running locally or remotely.

Next, we will create a file that is used to configure the host.

Create a liveui.config.js under the src folder with the following command:

```sh
liveui init
```

The newly created config file will have a content similar to the following:

```js title="src/liveui.config.js"
module.exports = {
    // ...
    // other configuration options
    shares: {
        react: require('react'),
        'react-dom': require('react-dom'),
    },
    remotes: {
        foo: 'http://localhost:5001/foo',
    }
}
```

> We created the config file under the src folder because of Create React App does not support relative imports outside of `src/`. If you use something else like react-boilerplate it's recommended that create the config file under the root folder.

In the above config, we define the [`shares`](/docs/LiveUI/explore#shares) configuration option to tell what libraries, packages, components, or static files will be commonly used between the host application and [`remotes`](/docs/LiveUI/explore#remotes).  This will optimize the bundles that are used in runtime by avoiding duplications of libraries in the host and remote packages.

The [`remotes`](/docs/LiveUI/explore#remotes) option is where we specify the name and URL of our component. If you remember, in the previous section when we start the application the remote component was running on [http://localhost:5001/foo](http://localhost:5001/foo).

Open `index.js` under the src folder and edit to initialize the the host app with the LiveUI config:

```diff title="src/index.js"
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
+ import liveuiConfig from './liveui.config';
+ import liveui from '@eclipse-muto/liveui-core';

+ liveui.initializeApp(liveuiConfig);


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

Open `App.js` under the src folder and edit it as follows:

```diff title="src/App.js"
import React from 'react';
import logo from './logo.svg';
import './App.css';
+ import RemoteComponent from '@eclipse-muto/liveui-react';

+ const Foo = props =>  <RemoteComponent name="foo" {...props} />

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
+      <Foo />
    </div>
  );
}

export default App;
```

We define our remote component as follows:

```js
const Foo = props =>  <RemoteComponent name="foo" {...props} />
```

> The 'name' prop is should be the same in the config we defined.

Save changes and start the application. At the same time you should start the LiveUI app created in the previous section to see our first remote component. 

That's it! You created your first LiveUI Web App. But there’s more! You can use different styles to organize your codebase,  customizing the liveui.config allows you to use working with different codebases, deployment of multiple components, etc.  Read to learn more about LiveUI and explore the documentation!