'use strict';

const util = require('./util');
const cmd = require('./cmd');

/**
 * config object
 * 
 * @constructor
 */
var config = function () {
    this.setUtil(util);
    this.setCmd(new cmd());
};

/**
 * initialize method
 * 
 * @param {String} [configJsonPath] - Path to config file optional
 * @return {Object} this
 */
config.prototype.init = function (configJsonFilename) {
    const stage = this.cmd.getStage();
    const debug = this.cmd.getVerbose();

    this.stage = stage;
    this.debug = debug;

    if (configJsonFilename) {
    
        const config = this.readConfig(configJsonFilename);
        this.setConfig(config);

    }

    return this;
};

/**
 * setter util
 * 
 * @param {Object} util
 * @return {Object} this
 */
config.prototype.setUtil = function (util) {
    this.util = util;
    return this;
};

/**
 * setter cmd
 * 
 * @param {Object} cmd
 * @return {Object} this
 */
config.prototype.setCmd = function (cmd) {
    this.cmd = cmd;
    return this;
};

/**
 * setter config
 * 
 * @return {Object} config
 * @return {Object} this
 */
config.prototype.setConfig = function (config) {
    this.config = config;
    return this;
};

/**
 * read config json file
 * 
 * @param {String} configJsonFilename
 * @return {Object} config
 */
config.prototype.readConfig = function (configJsonFilename) {
    const configObject = this.util.readJsonFile(configJsonFilename);
    let config = {
        dest: '',
        src: [],
        delete: false,
        logfile: ''
    }

    Object.assign(config, configObject.stage[this.getStage()]);
    config.logfile = configObject.logfile;

    return config;
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
