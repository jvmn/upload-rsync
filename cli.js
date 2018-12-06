#!/usr/bin/env node
'use strict';

const transfer = require('./index');

try{
    new transfer.rsync()
        .init()
        .run();
} catch (err) {
    console.log(err.stack)
}
