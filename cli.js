#!/usr/bin/env node
'use strict';

const upload = require('./index');
const inquirer = require('inquirer');
const yargs = require('yargs');

const argv = yargs
    .usage('$0 [options]')
    .options({
        'prod': { alias: 'p', type: 'boolean', desc: 'Upload to prod stage', default: false },
        'test': { alias: 't', type: 'boolean', desc: 'Upload to test stage', default: false },
        'dev': { alias: 'd', type: 'boolean', desc: 'Upload to dev stage (default)', default: false },
        'verbose': { alias: 'v', type: 'boolean', desc: 'More information output', default: false },
        'yes': { alias: 'y', type: 'boolean', desc: 'Avoid prompting for rsync execution', default: false }
    })
    .help()
    .version()
    .strict(true)
    .showHelpOnFail(false, 'Specify --help for available options')
    .argv

try {
    const cmd = new upload.cmd(argv);

    const config = new upload.config(cmd)
        .init('upload-rsync.config.json');

    const rsync = new upload.rsync(config)
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
