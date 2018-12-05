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

