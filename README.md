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

#### Express Logger

Supports attaching the logger to express with express-pino-logger.

```javascript
const { logger, debug } = require('@deployable/log').fetch('dply:express')
const app = require('express')()
app.use(logger.express())

```

### Test Usage

Setting the `NODE_ENV` environment variable to `test` will cause the pino logger
to store output in the ringbuffer rather than it's normal output. 

Get the last log from the buffer as an object:

    Log.testGetLastLog()

Get all logs in the buffer, as objects:

    Log.testGetAllLogs()


### License

deployable-log is released under the MIT license.
Copyright 2016 Matt Hoyle - Deployable Ltd

https://github.com/deployable/node-deployable-log

