#!/usr/bin/env node
'use strict';

const transfer = require('./index');
const util     = require('./lib/util');
const Rsync    = require('rsync');

rsync = new Rsync()

const cmd = new transfer.cmd()
const config = new transfer.config(cmd, 'deploy.config.json')
new transfer.rsync(config, util).run(rsync);
