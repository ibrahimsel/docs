---
id: debugging
title: Debugging
sidebar_label: Debugging
sidebar_position: 6
---

Just as we can debug our own project, we can also debug the LiveUI project from within our main project.


## How to Debug

To debug the Javascript code of your React app do the following:

## React

For more information on debugging, you can follow the [React Debugging](https://reactjs.org/docs/design-principles.html#debugging)

#### For Windows and Linux

**1.** Run your application.    
**2.** Press Ctrl + Shift + I to open the Chrome Developer tools, or open it via View -> Developer -> Developer Tools.  
**3.** You should now be able to debug as you normally would.

#### For macOS

**1.** Run your application.    
**2.** Press Command + Option + I to open the Chrome Developer tools, or open it via View -> Developer -> Developer Tools.  
**3.** You should now be able to debug as you normally would.

#### Example

As live components, we launch the page we started from the parent project in debug mode. We see that the page starts in debug mode without any further action.

 <p align="center">
<img src="../img/debugreactss.png" />
</p>
We are opening our page by searching that we created in LiveUI.
We debug by selecting the lines we want to debug.

<p align="center">
<img src="../img/reactdebug.png"/>
</p>


## React Native

For more information on debugging, you can follow the [React Native Debugging](https://reactnative.dev/docs/debugging.html)

#### For Android

**1.** Run your application in the android simulator.   
**2.** Press Ctrl + M and a webpage should open up at [http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui)    
**3.** Enable Pause On Caught Exceptions for a better debugging experience.     
**4.** Press Ctrl + Shift + I to open the Chrome Developer tools, or open it via View -> Developer -> Developer Tools.  
**5.** You should now be able to debug as you normally would.

#### For iOS

**1.** Run your application in the iOS simulator.   
**2.** Press Command + D and a webpage should open up at [http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui)     
**3.** Enable Pause On Caught Exceptions for a better debugging experience.     
**4.** Press Command + Option + I to open the Chrome Developer tools, or open it via View -> Developer -> Developer Tools.  
**5.** You should now be able to debug as you normally would.

#### Example

As live components, we launch the page we started from the parent project in debug mode. We see that the page starts in debug mode without any further action.

 <p align="center">
<img src="../img/loginscreen.png" width="250" height="350" />
&emsp;&emsp;
<img src="../img/child-login-debug.png" width="250" height="350" />
</p>
We are opening our page by searching that we created in LiveUI.
We debug by selecting the lines we want to debug.

<p align="center">
<img src="../img//child-login-debug-chrome.png"/>
</p>

> If the debug page you requested is not loaded, you cannot find the page.