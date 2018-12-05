'use strict';

const fs = require("fs");
const path = require('path');

/**
 * Check destination of rsync command
 * example: "user@dev.example.com:/path/to/dev"
 * 
 * @param {String} destination - destination
 * @return {Boolean}
 * @throws {Error}
 */
const checkDestination = function (destination) {
    if (! /^[a-zA-Z0-9,._+:@/-]{2,}@[a-zA-Z0-9,._+:@/-]{5,}:[a-zA-Z0-9,._+:@/-]{5,}$/.test(destination)) {
        throw new Error('The configured destination "' + destination + '" failed regex check');
    }
    return true;
};

/**
 * Check local src dirs to be synced
 * 
 * @param {Array} src - src
 * @return {Boolean}
 * @throws {Error}
 */
const checkSrc = function (src) {
    if (!src) {
        throw new Error('Please set src config param');
    }
    if (!Array.isArray(src)) {
        throw new Error('Please set src config param as array');
    }
    if (! src.length) {
        throw new Error('Src config param is empty');
    }
    src.forEach(function (dirname) {
        if (! dirname) {
            throw new Error('Dirname in src config param is empty');
        }
        const absDirname = path.resolve(dirname);
        if (! isDir(absDirname)) {
            throw new Error('Dirname ' + absDirname + ' not found');
        }
    })
    return true;
};

/**
 * Append file
 * 
 * @param {String} logfile - Filename of the logfile
 * @param {String} data    - Logdata
 * @return {Boolean}
 */
const logToFile = function (filename, data) {
    if (filename) {
        const absFilename = path.resolve(filename);
        if ( canReadAndWriteFile(absFilename) ) {
            fs.appendFileSync(absFilename, data, 'utf8');
            return true;
        }
    }
    return false;
};

/**
 * Clear file
 * 
 * @param {String} filename - Filename
 * @return {Boolean}
 */
const clearFile = function (filename) {
    if (filename) {
        const absFilename = path.resolve(filename);
        if ( canReadAndWriteFile(absFilename) ) {
            fs.writeFileSync(absFilename, '', 'utf8');
            return true;
        }
    }
    return false;
};

/**
 * Check dirname
 * 
 * @param {String} dirname - dirname
 * @return {Boolean}
 */
const isDir = function (dirname) {
    if (dirname) {
        const absDirname = path.resolve(dirname);
        if (! fs.existsSync(absDirname) || ! fs.statSync(absDirname).isDirectory()) {
            return false;
        }
        return true;
    }
    return false;
};

/**
 * Check if filename exists
 * 
 * @param {String} filename - Filename
 * @return {Boolean}
 */
const isFile = function (filename) {
    if (filename) {
        const absFilename = path.resolve(filename);
        if (! fs.existsSync(absFilename) || ! fs.statSync(absFilename).isFile()) {
            return false;
        }
        return true;
    }
    return false;
};

/**
 * Check filename
 * 
 * @param {String} filename - Filename
 * @return {Boolean}
 */
const canReadAndWriteFile = function (filename) {
    if (filename) {
        const absFilename = path.resolve(filename);
        const dirname = path.dirname(absFilename);

        if (isDir(absFilename)) {
            return false;
        }
        if (! dirname || ! isDir(dirname)) {
            return false;
        }
        try {
            fs.accessSync(dirname, fs.constants.R_OK | fs.constants.W_OK);
        } catch ( err ) {
            return false;
        }

        return true;
    }
    return false;
};

/**
 * Append file
 * 
 * @param {String} configJsonFilename - Filename read json fom
 * @return {Object|Array}
 */
const readJsonFile = function (configJsonFilename) {
    if (configJsonFilename && isFile(configJsonFilename)) {
        return JSON.parse(
            fs.readFileSync(configJsonFilename)
        );
    }
    return null;
};

module.exports = {
    checkDestination:    checkDestination,
    checkSrc:            checkSrc,
    isDir:               isDir,
    isFile:              isFile,
    canReadAndWriteFile: canReadAndWriteFile,
    clearFile:           clearFile,
    logToFile:           logToFile,
    readJsonFile:        readJsonFile
};
