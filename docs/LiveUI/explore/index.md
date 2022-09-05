---
id: liveui.config
title: Configure LiveUI
sidebar_label: Configure LiveUI
sidebar_position: 3
---

LiveUI is designed to be configurable like other tools Webpack, Babel, or ESlint.

To see what LiveUI config looks like you just continue on the your project folder with the following command:

```sh
liveui init
```

> This command works when you installed the [@eclipse-muto/liveui](https://github.com/composiv/liveui) package globally. For the same result 'npx @eclipse-muto/liveui' can be run.

## Options

### **`devPort`**

Specify a port number to run development server.

```js
devPort: 5000
```

> Only works with web applications

*default: 5000*

### **`exposes`**

Module paths to be exposed to use in other LiveUI applications.

```js
exposes: {
    '<moduleName>': '<modulePath>',
    'foo': './src/index.js',
}
```

> http://localhost:5001/foo

### **`hotReloadContext`**

A dir path to be watched for hot module replacement.

```js
hotReloadContext: 'src'
```

> Only works with web applications

*default: src*

### **`microPort`**

Specify a port number to serve modules that have been selected as remote.

```js
microPort: 5001
```
> http://localhost:5001

*default: 5001*

### **`shared`**

Specify modules like libraries or custom functions to depend on host dependencies.

```js
shared: [
    'react',
    'react-dom',
    'react-native',
    'components/Button',
    'utils/injectReducers'
]
```

### **`shares`**

Specify modules like libraries or custom functions to use by remotes.

```js
shares: {
    react: require('react'),
    'react-dom': require('react-dom'),
    'react-native': require('react-native'),
    'components/Button': require('components/Button'),
    'utils/injectReducers': require('utils/injectReducers'),
}
```

### **`remotes`**

Specify what remotes consumed by the host.

```js
remotes: {
    '<moduleName>': '<moduleUrl>'
    foo: 'http://localhost:5001/foo',
    bar: 'https://liveui.composiv.ai/bar
}
```