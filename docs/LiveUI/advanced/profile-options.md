---
id: profile-options
title: Custom Options
sidebar_label: Custom Options
sidebar_position: 7
---

When you want to use LiveUI in your project, you do not need to prepare any configuration files because there is already a default configuration file in LiveUI.

### Defaults

You can retrieve LiveUI's default options to expand them if needed:

    module.exports = {
        shared: [
            "react",
            "react-dom",
            "react-native"
        ],
        exposes: {
            'foo': './src/index.js'
        },
        hotReloadContext: 'src',
        devPort: 5000,
        microPort: 5001
    }
    
---
### Using Your Own Config File


There is no limit to what can be done in projects. So you might want to use a customized config. If you create another configuration file and want to use it, all you have to do is write the command below into the terminal.

    npm start --config <path/to/<config-file>.js>

With this command, your project will start using the configuration file you directed.


