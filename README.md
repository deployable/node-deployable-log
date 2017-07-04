# [@deployable/log](https://github.com/deployable/node-deployable-log)

Deployable Logging, [pino](https://github.com/pinojs/pino) and [debug](https://github.com/visionmedia/debug).

### Install
 
    npm install @deployable/log --save

    yarn add @deployable/log

### Usage

```javascript

const { logger, debug } = require('@deployable/log').fetch('dply:tag')
logger.info('testing')
debug('testing') // Requires `DEBUG` to be set in the environment

```

### License

deployable-log is released under the MIT license.
Copyright 2016 Matt Hoyle - Deployable Ltd

https://github.com/deployable/node-deployable-log

