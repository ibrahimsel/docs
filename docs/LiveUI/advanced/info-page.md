---
id: info-page
title: Micro Frontend Information Page
sidebar_label: Micro Frontend Information Page
sidebar_position: 5
---

This document is about the LiveUI Micro Frontend Information Page.

To view this information page,first you must start your micro frontend, that is, run it as a service. To do this, you need to specify the micro frontends you want to work with in your LiveUI configuration file and run a command.

For more information about LiveUI Configuration File [click here](/docs/LiveUI/explore).

If you have not changed the port in your configuration file, this information page can be viewed via http://localhost:5001 after running the command. Port 5001 is the default port in LiveUI. If you change the port, you must use the new port in the url extension.

>http://localhost:yourPort

### Command for Starting a Micro Frontend
If you are using React Framework, you have to run this command under the  micro frontend project. 
    
    npx liveui start

If you are using React Native Framework, you have to run this command under  the micro frontend project. 
    
    npx liveui start-native

## What's On This Information Page?

The information page contains the libraries that are defined as external in your configuration file and the routing information for the micro frontend. There is also an explanation of how you can add the micro frontend to your application.

 <p align="center">
<img src="../img/informationpage.png" />
</p>

>An Example Information Page for a micro front end running on port 5001.