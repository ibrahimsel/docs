---
id: liveui-react
title: LiveUI React
sidebar_label: LiveUI React
sidebar_position: 3
---

## What is LiveUI React ?

LiveUI React is a kind of intermediate library that we use to make live React projects between the main project and LiveUI Core.

In fact, LiveUI React is a React component. And this component inside the LiveUI React remotes your component in your project and send this remoteed component to LiveUI Core. 

### How Does LiveUI React Work ?

We sent a url address with the components we want to create in our config file. After we sent, this url address contains the component we created with our config file. LiveUI React takes the component at this url address and sends it to LiveUI Core. It converts LiveUI Core data to components and sends it back to the main project.

In summary, we launch the component we want to make live on a url address with the config file in our main project. Thanks to LiveUI React, we get this url address and pass it to LiveUI Core. LiveUI Core converts this data to components and sends it back to the main project. 

For more information about Liveui Core, [click here](liveui-core).

### Installation

    npm install @eclipse-muto/liveui-react

### How To Use LiveUI React ?

In the main project, you have to import RemoteComponent from LiveUI React library inside of which page you want to use your component. Then we get our live component at url with Remote Component and assign it to a constant.-We call this component "Foo".-

    import RemoteComponent from '@eclipse-muto/liveui-react';

    const Foo = props => (
        <RemoteComponent url="http://localhost:5001/foo" {...props} />
    );

Finally, your Foo is ready to use:

    export function HomePage() {
        return (
                <div>
                  <Foo />
                </div>
        );
    }

