---
id: args
title: Arguments
sidebar_label: Arguments
sidebar_position: 5
---

```json
"arg": [
    {
        "name": "config_path",
        "value": "/path/to/config"
    }
]
```

If you need to reference this argument from multiple places, you can accomplish it like below:

```json
{
    "name": "extended_config",
    "value": "$(arg config_path).cfg"
}
```

Muto will detect that `$(arg config_path)` and parse it accordingly. The value will be `/path/to/config.cfg` now. 

Find out more about arg parsing [here](https://github.com/eclipse-muto/composer/blob/5166e62ed1989905bc100562a05dcc7c54f16414/composer/model/stack.py#L535)