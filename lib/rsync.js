'use strict';

const util   = require('./util');
const Rsync  = require('rsync');

/**
 * rsync wrapper 
 * 
 * @constructor
 * @param {Object} config
 */
var rsync = function (config) {
    this.setUtil(util);
    this.setRsync(new Rsync());
    this.config = config;
};

/**
 * initialize method
 * 
 * @return {Object} this
 */
rsync.prototype.init = function () {
    this.destination = this.config.getDest();
    this.util.checkDestination(this.destination);

    this.src = this.config.getSrc();
    this.util.checkSrc(this.src);

    this.logfile = this.config.getLogfile();
    this.util.canReadAndWriteFile(this.logfile);
    this.util.clearFile(this.logfile);

    this.delete = this.config.getDelete();
    this.debug  = this.config.getDebug();
    
    console.log('Start transfer to "' + this.config.getStage() + '" stage');

    return this;
};

/**
 * setter util
 * 
 * @param {Object} util
 * @return {Object} this
 */
rsync.prototype.setUtil = function (util) {
    this.util = util;
    return this;
};

/**
 * setter rsync
 * 
 * @param {Object} Rsync
 * @return {Object} this
 */
rsync.prototype.setRsync = function (rsync) {
    this.rsync = rsync;
    return this;
};

/**
 * Execution of rsync transfer sript
 * @return {Object} this
 */
rsync.prototype.setup = function () {
    // Build the command
    this.rsync
        .flags('v')
        .set('stats')
        .set('checksum')
        .archive()
        .compress()
        //.progress() don't be so verbose
        .source(this.src)
        .destination(this.destination);

    if (this.delete === true) {
        this.rsync.delete()
    }

    if (this.debug === true) {
        console.log('rysnc options', this.rsync._options);
        console.log('rysnc sources', this.rsync._sources);
        console.log('rysnc destination', this.rsync._destination);
    }

    return this;
};

/**
 * Execution of rsync transfer sript
 */
rsync.prototype.run = function (cb) {

    try {
        this.util.checkDestination(this.rsync.destination());
    } catch (err) {
        throw new Error('Setup rsync command first');
    }

    // Execute the command
    this.rsync.execute((error, code, cmd) => {
        // we're done
        if (error) {
            console.log('deploy failed', error);
        } else if (this.debug === true) {
            console.log('deploy done', error, code, cmd);
        } else {
            console.log('deploy done');
        }
        // return a callback if provided
        if (cb) cb();
    }, (data) => {
        const msg = data.toString();
        // stdout
        if (msg) {
            console.log(msg);
            this.util.logToFile(this.logfile, msg);
        }
    }, (data) => {
        const msg = data.toString();
        // stderr
        if (msg) {
            console.log(msg);
            this.util.logToFile(this.logfile, msg);
        }
    });
};

module.exports = rsync;
