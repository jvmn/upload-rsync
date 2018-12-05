'use strict';

/**
 * rsync wrapper 
 * 
 * @param {Object} config           - Config object
 * @param {Object} rsync            - Rsync object (require('rsync'))
 * @param {Object} util             - util object (require('./util');)
 * 
 * @constructor
 */
var rsync = function (config, util) {
    this.util = util;

    this.destination = config.getDest();
    this.util.checkDestination(this.destination);

    this.src = config.getSrc();
    this.util.checkSrc(this.src);

    this.logfile = config.getLogfile();
    this.util.canReadAndWriteFile(this.logfile);
    this.util.clearFile(this.logfile);

    this.delete = config.getDelete();
    this.debug  = config.getDebug();
    
    console.log('Start transfer to "' + config.stage + '" stage');
};

/**
 * Execution of rsync transfer sript
 * 
 * @param {Object} [rsync]          - Rsync object (optional)
 */
rsync.prototype.run = function (rsync) {
    // Build the command
    rsync
        .flags('v')
        .set('stats')
        .set('checksum')
        .archive()
        .compress()
        .progress()
        .source(this.src)
        .destination(this.destination);

    if (this.delete === true) {
        rsync.delete()
    }

    if (this.debug === true) {
        console.log('rysnc options', rsync._options);
        console.log('rysnc sources', rsync._sources);
        console.log('rysnc destination', rsync._destination);
    }

    // Execute the command
    rsync.execute((error, code, cmd) => {
        // we're done
        if (error) {
            console.log('deploy failed', error);
        } else if (this.debug === true) {
            console.log('deploy done', error, code, cmd);
        } else {
            console.log('deploy done');
        }
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
