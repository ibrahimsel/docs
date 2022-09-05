---
id: building
title: Building
sidebar_label: Building
sidebar_position: 8
---


    npm run build
>To do this, it must be created by the LiveUI generator.

Preps your components for deployment (does not run tests). Optimizes and minifies all files, piping them to the `docker/dist` folder.

Upload the contents of docker/dist to your web server to see your work live!

Also, the docker folder includes a Dockerfile to dockerize all components. 

Run the following command at the root of your project:

    docker build -t liveui/live-components:latest ./docker/

To run the container:

    docker run --rm -dit -p 6767:80 liveui/live-components:latest

Your components will be server at http://localhost:6767:

    http://localhost:6767/<component-name>

>  Component name you created in live-components.
