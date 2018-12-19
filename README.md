# upload-rsync

## What is this script doing?

This script offers an command to upload files and folders from your projectfolder to your remote environment (dev, test and prod).
For example this can be your build folder. 

## How is it doing it?

The upload is executed via an ssh/rsync command. This rsync command is implemented by using an rsync-wrapper [node-rsync](https://github.com/mattijs/node-rsync).

## Installation

npm:
```
npm install @jvmn/upload-rsync --save-dev
```

yarn:
```
yarn add @jvmn/upload-rsync --dev
```

## Configuration

Create a "upload-rsync.config.json"-file in your root directory. You can copy it from here [blob/master/upload-rsync.config.json](https://github.com/jvmn/upload-rsync/blob/master/upload-rsync.config.json)

The configuration options are aliases of the rsync options. You can find them here [man rsync](https://linux.die.net/man/1/rsync)

You can configure three stages dev, test and prod, with the following options.

### Options

Name           | Description
-------------- | ------------
dest           | DEST ([USER@]HOST:DEST) of the rsync command. e.g. "user@example.com:/path/to/dest"
src            | SRC of the rsync command. Needs to be an array. e.g. [ "local/path1", "local/path2", ... ]
delete         | --delete flag of the rsync command. deletes extraneous files from dest dirs
logfile        | you can set a logfile location. the logfiles holds informations about the last upload.

## Authorization

To use rsync you need a valid ssh user on the destination server. By default you can use passwort authorization. 
More convenient is the usage of ssh-key authorization.
See [https://wiki.ubuntuusers.de/SSH/](https://wiki.ubuntuusers.de/SSH/) for a detailed explanation of how to use ssh keys.

## Usage

### Command line

If you configured a "upload-rsync.config.json"-file, you can use the following cli command.

```
npx upload-rsync [options]
```

Before the execution of the rsync upload you will and get a prompt with the actual rsync command if you want to proceed.

#### Commandline Options

Name           | Description
-------------- | ------------
--help         | Show help
--version      | Show version number
--prod, -p     | Upload to prod stage 
--test, -t     | Upload to test stage
--dev, -d      | Upload to dev stage (default)
--verbose, -v  | More information output
 --yes, -y     | Avoid prompting for rsync execution

# Scripting

You can also write your own script. Here is an example.

```
#!/usr/bin/env node
'use strict';

const upload = require('@jvmn/upload-rsync');
const inquirer = require('inquirer');

try {
    const cmd = new upload.cmd({
        'commandlineflag' : true
    });
    const config = new upload.config(cmd)
        .setConfig({
            dest: 'user@example.com:/path/to/src',
            src: ['folder'],
            logfile: 'logfile',
            delete: false
        })
        .init();
    const rsync = new upload.rsync(config)
        .init()
        .setup();

    console.log("rsync command: \n" + rsync.rsync.command());

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
} catch (err) {
    console.log(err.stack)
}
```

## Changelog

0.0.5

- refactored dependency injection

0.0.4

- refactored config file dependency

0.0.3

- dependencies revision

0.0.2

- refactoring
- command line prompt for execution

0.0.1

- initial release
