'use strict';

const yargs = require('yargs');

const argv = yargs
    .usage('$0 [options]')
    .options({
        'prod': { alias: 'p', type: 'boolean', desc: 'Upload to prod stage', default: false },
        'test': { alias: 't', type: 'boolean', desc: 'Upload to test stage', default: false },
        'dev': { alias: 'd', type: 'boolean', desc: 'Upload to dev stage (default)', default: false },
        'verbose': { alias: 'v', type: 'boolean', desc: 'More information output', default: false },
        'yes': { alias: 'y', type: 'boolean', desc: 'Do not show commad and prompt for execution', default: false }
    })
    .help()
    .version()
    .strict(true)
    .showHelpOnFail(false, 'Specify --help for available options')
    .argv

/**
 * commandline wrapper
 * 
 * @constructor
 */
var cmd = function () {
    this.setArgv(argv);
};

/**
 * setter argv
 * 
 * @param {Object} argv
 * @return {Object} this
 */
cmd.prototype.setArgv = function (argv) {
    this.argv = argv;
    return this;
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
