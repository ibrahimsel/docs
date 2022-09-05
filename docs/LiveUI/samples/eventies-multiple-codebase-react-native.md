---
id: eventies-multiple-codebase-react-native
title: Eventies - Multiple Codebase for React Native
sidebar_label: Eventies - Multiple Codebase for React Native
---

<p align="center">
    <img src="../img/showcase-eventies.png" />
</p>

[This application](https://github.com/composiv/liveui-samples/eventies-multiple-codebase-react-native) is an implementation of [Multiple Codebase for React Native](/docs/LiveUI/advanced/multiple-codebases-react-native).

---

This example consists of 3 applications. The host application which called `eventies` consumes `simple-login` and `eventies-components`. 

<p align="center">
    <img src="../img/eventies-diagram.png" />
</p>


Clone the samples repo using the following command:
```command
git clone https://github.com/composiv/liveui-samples
```

## Starting the Host Application - eventies

Move to the host application directory:
```command
cd samples/eventies-multiple-codebase-react-native/eventies
```

Install required packages:
```command
npm install
```

For IOS:
```command
npx pod-install
npm run ios
````

For Android:
```command
npm run android
```

Start Metro Bundler:
```command
npm start
```

## simple-login

This application is a traditional react-native application and can be run as follows:
```command
cd samples/eventies-multiple-codebase-react-native/simple-login
npm install
```

For IOS:
```command
npx pod-install
npm run ios
````

For Android:
```command
npm run android
```

Start Metro Bundler:
```command
npm start
```
> The command above will also run the remote component that has specified on the liveui.config file.

To run remote component only:
```command
npm run start-live
```
> This command was defined on the `scripts/package.json` and runs `@eclipse-muto/liveui start-native` command. For more information about LiveUI CLI commands, please check [it's documentation](/docs/LiveUI/api-reference/liveui).

## eventies-components

This application is a traditional react-native application and can be run as follows:
```command
cd samples/eventies-multiple-codebase-react-native/eventies-components
npm install
```

For IOS:
```command
npx pod-install
npm run ios
````

For Android:
```command
npm run android
```

Start Metro Bundler:
```command
npm start
```
> The command above will also run the remote component that has specified on the liveui.config file.

To run remote component only:
```command
npm run start-live
```
> This command was defined on the `scripts/package.json` and runs `@eclipse-muto/liveui start-native` command. For more information about LiveUI CLI commands, please check [it's documentation](/docs/LiveUI/api-reference/liveui).
