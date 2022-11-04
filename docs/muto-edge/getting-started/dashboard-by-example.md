---
id: dashboard-by-example
title: Dashboard By Example
sidebar_label:  Dashboard By Example
sidebar_position: 1
---

In this section, we will quickly describe how to start and get familiar with using Muto Dashboard by the way of examples.

### Prerequisites
- [mqttx](https://mqttx.app/ "Heading link")<br/>
- [docker](https://docs.docker.com/engine/install/ "Heading link")<br/>
- [npm >= 5](https://www.npmjs.com/get-npm/ "Heading link")<br/>



### Definition

Dashboard is an extensible liveUI plugin that enables the user to communicate with Muto driven vehicles and their Digital Twins.


### Installation


- Create a dedicated workspace for dashboard.

This project was bootstrapped with Create React App.

- Clone the repository:

```bash
git clone https://github.com/eclipse-muto/dashboard
```


### How to Start

- Install dependencies (from the root folder where package.json is located):
```bash
cd yourdirectory/dashboard
npm install or npm i (identical)
npm run start or npm start (see difference)
```

You should see 

```sh
ℹ ｢wdm｣: Compiled successfully.
```

and the server should start.


Here you'll be greeted by the page similar to the one in `Muto by Example`
The only difference is there's a new tab called `F1Tenth`
If you navigate to this tab you'll see the following: 


<p align="center">
    <img src="../../../img/f1tenthpage.png" style={{scale:0.5}}/> 
</p>

Then you'll navigate to your desired vehicle (docs-bcx-01 in this case)
You'll be greeted by the Vehicle Details page

<p align="center">
    <img src="../../../img/dashvehicledet.png" style={{scale:0.5}}/> 
</p>



When you move the joystick in the corresponding directions you should see the MQTTX responses.

<p align="center">
    <img src="../../../img/mqttfor.png" style={{scale:0.5}}/> 
</p>

<p align="center">
    <img src="../../../img/mqttback.png" style={{scale:0.5}}/> 
</p>

<p align="center">
    <img src="../../../img/mqttleft.png" style={{scale:0.5}}/> 
</p>

<p align="center">
    <img src="../../../img/mqttright.png" style={{scale:0.5}}/> 
</p>




What seperates this example from the ones before is that you can use the joystick here. Follow the steps in `Muto by Example` and then you can give inputs through the joystick and observe the corresponding vehicle movement in foxglove.


