'use strict';

/**
 * commandline wrapper
 * 
 * @constructor
 * @param {Object} argv
 */
var cmd = function (argv) {
    this.argv = argv;
};

/**
 * getter stage
 * 
 * @return {String} stage - Stage selection mapped from commandline argv
 */
cmd.prototype.getStage = function () {
    let stage = 'dev';
    if (this.getProd()) {
        stage = 'prod';
    } else if (this.getTest()) {
        stage = 'test';
    }
    return stage
};

/**
 * getter prod
 * 
 * @return {Boolean} prod - Flag to transfer to prod environment
 */
cmd.prototype.getProd = function ( ) {
    return this.argv && this.argv.prod;
};

/**
 * getter test
 * 
 * @return {Boolean} test - Flag to transfer to test environment
 */
cmd.prototype.getTest = function ( ) {
    return this.argv && this.argv.test;
};

/**
 * getter dev
 * 
 * @return {Boolean} dev - Flag to transfer to dev environment (default)
 */
cmd.prototype.getDev = function ( ) {
    return this.argv && this.argv.dev;
};

/**
 * getter verbose
 * 
 * @return {Boolean} verbose - Flag to output more verbose output
 */
cmd.prototype.getVerbose = function ( ) {
    return this.argv && this.argv.verbose;
};

/**
 * getter yes
 * 
 * @return {Boolean} yes - Flag to avoid prompting for rsync execution
 */
cmd.prototype.getYes = function ( ) {
    return this.argv && this.argv.yes;
};

module.exports = cmd;
