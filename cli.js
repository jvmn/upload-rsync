#!/usr/bin/env node
'use strict';

const transfer = require('./index');
const inquirer = require('inquirer');

try{
    const rsync = new transfer.rsync()
        .init()
        .setup();

    const config = rsync.config;

    console.log("rsync command: \n" + rsync.rsync.command());

    if (config.executeWithoutPrompt()) {
        rsync.run();
    } else {
        inquirer.prompt([
            {
              type: 'confirm',
              name: 'execute',
              message: 'Start upload?',
              default: true
            }
          ])
          .then(answers => {
            if (answers.execute) {
                rsync.run();
            }
          });
    }
} catch (err) {
    console.log(err.stack)
}
