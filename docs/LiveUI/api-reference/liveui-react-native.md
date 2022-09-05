---
id: liveui-react-native
title: LiveUI React Native
sidebar_label: LiveUI React Native
sidebar_position: 5
---

## What is LiveUI React Native ?

LiveUI React Native is a kind of intermediate library that we use to make live React Native projects between the main project and LiveUI Core.

In fact, LiveUI React Native is a React Native component. And this component inside the LiveUI React Native remotes your component in your project and send this remoteed component to LiveUI Core. 

### How Does LiveUI React Native Work ?

We launch a url address -with a script- with the components we want to create in our config file from the main project. After the launch on url address, this url address contains the component we created with our config file. LiveUI React Native takes the component on this url address and sends it to LiveUI Core. It converts liveui-core data to components and sends it back to the main project.

In summary, we launch the component we want to make live on a url address with the config file in our main project. Thanks to LiveUI React Native, we get this url address and pass it to LiveUI Core. LiveUI Core converts this data to components and sends it back to the main project. 

For more information about LiveUI Core, [click here](liveui-core).

### Installation

    npm install @eclipse-muto/liveui-react-native

### How To Use LiveUI React Native ?

In the main project -we call it parent project- you have to import RemoteComponent from LiveUI React Native library inside of which page you want to use your component. Then we get our live component at url with Remote Component and assign it to a constant.-We call this component "Foo".-

    import RemoteComponent from '@eclipse-muto/liveui-react-native';

    const Foo = props => (
        <RemoteComponent url="http://localhost:5001/foo" {...props} />
    );

Finally, your Foo is ready to use:

    export function HomePage() {
        return (
                <View>
                  <Foo />
                </View>
        );
    }
