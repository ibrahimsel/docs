---
id: multiple-codebases-react-native
title: Multiple Codebases for React Native
sidebar_label: Multiple Codebases for React Native
sidebar_position: 4
---

This document is about multiple code bases of LiveUI in your projects.

Multiple code bases are use for split projects where the project has one or more child project.


### Multiple Remote Components

If you create more remote components you have to change the default configurations by creating a file called liveui.config.js with the following content at the root of your LiveUI project (where the package.json is). In this file you define which of your components will be remote.

```js
module.exports = {
    shared: ['react', 'react-native'],
    exposes: {
            foo: './src/index.js', 
    },
    hotReloadContext: 'src',
    microPort: 5001, 
}
```

### If you want to add a new remote component
---
Things to do in project liveui-child

- We create our new component file under src.

Then we add our component into liveui.config.js.

	foo: './src/foo.js',


### To call our component from the parent project 
---

First, we registered liveui in index.js.

    import liveui from '@eclipse-muto/liveui-core';
	import config from './liveui.config';
	liveui.initializeApp(config);


Then we add the url of the components we created in the liveui child project under the components in liveui.config.js in the liveui-parent project.

    components: {
        foo: 'http://localhost:5001/foo',
    }

>The 5001 port comes by default. If you want, you can change your liveport in liveui.config.js in the liveui-child project.

Then we call created components in app.js.

    import RemoteComponent from '@eclipse-muto/liveui-react-native';
    const Foo = () => <RemoteComponent name="foo" />;

And call your fresh new Foo inside the return function.

	<Foo /> 

