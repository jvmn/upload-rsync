# upload-rsync

## What is this script doing?

This script offers an command to upload files and folders from your projectfolder to your remote environment (dev, test and prod).

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

''

## Changelog

0.0.2

- refactoring
- command line prompt for execution

0.0.1

- initial version
