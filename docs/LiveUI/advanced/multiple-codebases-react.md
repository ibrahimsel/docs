---
id: multiple-codebases-react
title: Multiple Codebases for React
sidebar_label: Multiple Codebases for React
sidebar_position: 3
---

In this section, we will look at working with different codebases using LiveUI. If you did not read our [Organizing Your Codebase](organizing-your-codebase) section, we recommend to read the document first.

Let's assume we have a project structure like follows:

```
blog-app
└── .babelrc
└── components
│   └── Content.js
│   └── Footer.js
│   └── Header.js
├── public
│   └── index.html
└── App.js
└── Blog.js
└── HomePage.js
└── index.js
└── package.json
```

We want to add a page that is responsible for adding new posts. Instead of creating a new component on the blog app, we will create a project that contains our component and configure the blog app as a host app for the new component called a remote component.

Create a project via LiveUI cli:

```sh
npx liveui react add-post
```

We created a `react` project named `add-post` via the command above.

This is the initial project structure. For more information about this project please check our [Getting Started - React](docs/getting-started-react) section.
```
add-post
├── internals
│   └── index.js
├── package.json
├── public
│   └── index.html
└── src
    └── index.js
```

We will use `src/index.js` for our component.

```js title="src/index.js"

```



The `App.js` contains routing stuff.

```js
export default function App() {
  return (
      <>
        <Header />
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/blog/:id" component={Blog} />
        </Switch>
        <Footer />
      </>
  );
}
```

We have an other application that contains configurable SignUp/SignIn flow and we want to use this app in our blog-app.

```
signup-app
└── .babelrc
└── components
│   └── SignUp.js
│   └── SignIn.js
├── public
│   └── index.html
└── App.js
└── index.js
└── package.json
```

We will use SignIn/SignUp components in our blog application and 




### Multiple Live Components

If you create more remote components you have to change the default configurations by creating a file called liveui.config.js with the following content at the root of your LiveUI project (where the package.json is). In this file you define which of your components will be remote.
```js
module.exports = {
    shared: ['react', 'react-dom'],
    exposes: {
            foo: './src/index.js', 
    },
    hotReloadContext: 'src',
    microPort: 5001, 
}
```

### If you want to add a new live component
---
Things to do in project liveui-child:

- We create our new component file under src.

Then we add our component into liveui.config.js.

	foo: './src/foo.js',


### To call our component from the parent project 
---

First, we registered liveui in index.js.

    import liveui from '@eclipse-muto/liveui-core';
	import config from './liveui.config';
	liveui.initializeApp(config);


Then we add the url of the components we created in the LiveUI child project under the components in liveui.config.js in the liveui-parent project.

    components: {
        foo: 'http://localhost:5001/foo',
    }

>The 5001 port comes by default. If you want, you can change your liveport in liveui.config.js in the liveui-child project.

Then we call created components in app.js.

    import RemoteComponent from '@eclipse-muto/liveui-react';
    const Foo = () => <RemoteComponent name="foo" />;

And call your fresh new Foo inside the return function.

	<Foo /> 
