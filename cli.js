#!/usr/bin/env node
'use strict';

const upload = require('./index');
const inquirer = require('inquirer');

try {
    const config = new upload.config()
        .init('upload-rsync.config.json');

    const rsync = new upload.rsync()
        .setConfig(config)
        .init()
        .setup();

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
