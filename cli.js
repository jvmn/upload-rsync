#!/usr/bin/env node
'use strict';

const transfer = require('./index');

try{
    new transfer.rsync()
        .init()
        .setup()
        .run();
} catch (err) {
    console.log(err.stack)
}
