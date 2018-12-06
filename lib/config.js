'use strict';

const util        = require('./util');

/**
 * config object
 * 
 * @param {Object} cmd                      - Command line wrapper
 * @param {String} [configJsonPath]         - Path to config file optional
 * 
 * @constructor
 */
var config = function (cmd, configJsonFilename) {
    const stage = cmd.getStage();
    const debug = cmd.getVerbose();

    if (configJsonFilename) {
    
        const config = this.readConfig(configJsonFilename, stage);
        this.setConfig(config);

    }

    this.stage = stage;
    this.debug = debug;
    this.cmd = cmd;
};

/**
 * read config json file
 * 
 * @return {Object} configJsonFilename
 */
config.prototype.readConfig = function (configJsonFilename, stage) {
    const configObject = util.readJsonFile(configJsonFilename);
    let config = {
        dest: '',
        src: [],
        delete: false,
        logfile: ''
    }

    Object.assign(config, configObject.stage[stage]);
    config.logfile = configObject.logfile;

    return config;
};

/**
 * setter config
 * 
 * @return {Object} config
 */
config.prototype.setConfig = function (config) {
    this.config = config;
};

/**
 * getter stage
 * 
 * @return {String} stage - Stage selection from commandline argv
 */
config.prototype.getStage = function () {
    return this.stage;
};

/**
 * getter src
 * 
 * @return {String} dest - Destination for rsync like "user@example.com:/path/to/dest"?
 */
config.prototype.getDest = function () {
    return this.config && this.config.dest;
};

/**
 * getter src
 * 
 * @return {Array} src - Sourcefolders to transfer 
 */
config.prototype.getSrc = function () {
    return this.config && this.config.src;
};

/**
 * getter delete
 * 
 * @return {Boolean} delete - Flag for deleting missing target files and directories
 */
config.prototype.getDelete = function () {
    return this.config && this.config.delete;
};

/**
 * getter logfile
 * 
 * @return {String} logfile - Logfile, if set write output to that file
 */
config.prototype.getLogfile = function () {
    return this.config && this.config.logfile;
};

/**
 * getter debug
 * 
 * @return {Boolean} debug - Flag for verbose output
 */
config.prototype.getDebug = function () {
    return this.debug;
};

module.exports = config;
