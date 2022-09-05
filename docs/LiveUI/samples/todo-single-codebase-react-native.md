---
id: todo-single-codebase-react-native
title: Todo - Single Codebase for React Native
sidebar_label: Todo - Single Codebase for React Native
---

<p align="center">
    <img src="../img/showcase-todos.png" />
</p>

[This application](https://github.com/composiv/liveui-samples/todo-single-codebase-react-native) is an implementation of [Single Codebase for React Native](/docs/LiveUI/advanced/single-codebase-react-native).

---

Clone the samples repo using the following command:
```command
git clone https://github.com/composiv/liveui-samples
```

Move to the appropriate directory: 
```command
cd samples/todo-single-codebase-react-native
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
```
npm start
````

Start serving remote components:
```
npm run start:live
```
> This command was defined on the `scripts/package.json` and runs `@eclipse-muto/liveui start-native` command. For more information about LiveUI CLI commands, please check [it's documentation](/docs/LiveUI/api-reference/liveui).