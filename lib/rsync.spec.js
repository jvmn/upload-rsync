const transfer = require('../index');
const Rsync  = require('rsync');

describe("rsync suite", function () {
    let cmd;
    let config;
    let rsync;
    let rsyncSpy;
    let utilSpy;

    let realRsync;

    beforeEach(function () {
        cmd = new transfer.cmd();
        config = new transfer.config()
            .setCmd(cmd)
            .init();
        realRsync = new Rsync()
            .dry()
        /* eslint-disable no-unused-vars */
        rsyncSpy = {
            flags:       jasmine.createSpy().and.callFake(() => rsyncSpy),
            set:         jasmine.createSpy().and.callFake(() => rsyncSpy),
            archive:     jasmine.createSpy().and.callFake(() => rsyncSpy),
            compress:    jasmine.createSpy().and.callFake(() => rsyncSpy),
            progress:    jasmine.createSpy().and.callFake(() => rsyncSpy),
            source:      jasmine.createSpy().and.callFake(() => rsyncSpy),
            destination: jasmine.createSpy().and.callFake(() => rsyncSpy),
            delete:      jasmine.createSpy().and.callFake(() => rsyncSpy),
            isSet:       jasmine.createSpy().and.callFake(() => true)
        };
        utilSpy = {
            checkDestination:    jasmine.createSpy(),
            checkSrc:            jasmine.createSpy(),
            canReadAndWriteFile: jasmine.createSpy(),
            clearFile:           jasmine.createSpy(),
            logToFile:           jasmine.createSpy()
        };
        /* eslint-enable no-unused-vars */
        spyOn(console, 'log');
    });
    afterEach(function () {
        cmd = undefined;
        config = undefined;
        rsyncSpy = undefined;
    });

    it("test construct without configuration", function () {
        rsync = new transfer.rsync()
            .setConfig(config)
            .setUtil(utilSpy)
            .init();

        expect(rsync.util).toEqual(utilSpy);
        expect(rsync.delete).toBeUndefined();
        expect(rsync.debug).toBe(false);

        expect(utilSpy.checkDestination).toHaveBeenCalled();
        expect(utilSpy.checkSrc).toHaveBeenCalled();
        expect(utilSpy.canReadAndWriteFile).toHaveBeenCalled();
        expect(utilSpy.clearFile).toHaveBeenCalled();

        expect(utilSpy.checkDestination).toHaveBeenCalledTimes(1);
        expect(utilSpy.checkSrc).toHaveBeenCalledTimes(1);
        expect(utilSpy.canReadAndWriteFile).toHaveBeenCalledTimes(1);
        expect(utilSpy.clearFile).toHaveBeenCalledTimes(1);

        expect(utilSpy.checkDestination).toHaveBeenCalledWith(undefined);
        expect(utilSpy.checkSrc).toHaveBeenCalledWith(undefined);
        expect(utilSpy.canReadAndWriteFile).toHaveBeenCalledWith(undefined);
        expect(utilSpy.clearFile).toHaveBeenCalledWith(undefined);

        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('Start transfer to "dev" stage');
    });

    it("test construct with all config", function () {
        cmd.setArgv({ test: true, verbose: true });
        config = new transfer.config()
            .setCmd(cmd)
            .setUtil(utilSpy)
            .setConfig({
                dest: "user@test.example.com:/path/to/test",
                src: ['spec'],
                logfile: 'rsync.log',
                delete: true
            })
            .init();

        rsync = new transfer.rsync();
        rsync
            .setConfig(config)
            .setUtil(utilSpy)
            .init();

        expect(rsync).toEqual(jasmine.objectContaining({
            destination: 'user@test.example.com:/path/to/test',
            src: ['spec'],
            logfile: 'rsync.log',
            delete: true,
            debug: true
        }));

        expect(utilSpy.checkDestination).toHaveBeenCalled();
        expect(utilSpy.checkSrc).toHaveBeenCalled();
        expect(utilSpy.canReadAndWriteFile).toHaveBeenCalled();
        expect(utilSpy.clearFile).toHaveBeenCalled();

        expect(utilSpy.checkDestination).toHaveBeenCalledTimes(1);
        expect(utilSpy.checkSrc).toHaveBeenCalledTimes(1);
        expect(utilSpy.canReadAndWriteFile).toHaveBeenCalledTimes(1);
        expect(utilSpy.clearFile).toHaveBeenCalledTimes(1);

        expect(utilSpy.checkDestination).toHaveBeenCalledWith('user@test.example.com:/path/to/test');
        expect(utilSpy.checkSrc).toHaveBeenCalledWith(['spec']);
        expect(utilSpy.canReadAndWriteFile).toHaveBeenCalledWith('rsync.log');
        expect(utilSpy.clearFile).toHaveBeenCalledWith('rsync.log');

        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('Start transfer to "test" stage');
    });

    it("test with delete and verbose", function () {
        rsyncSpy.execute = function (cb, stdout, stderr) {
            cb(undefined, 1, 'cmd');
            const data1 = Buffer.from('stdout');
            const data2 = Buffer.from('stderr');
            stdout(data1);
            stderr(data2);
            return this;
        };
        cmd.setArgv({ test: true, verbose: true });
        config = new transfer.config()
            .setCmd(cmd)
            .setConfig({
                dest: "user@test.example.com:/path/to/test",
                src: ['spec'],
                logfile: 'rsync.log',
                delete: true
            })
            .init();
        rsync = new transfer.rsync()
            .setConfig(config)
            .setUtil(utilSpy)
            .setRsync(rsyncSpy)
            .init()
            .setup();

        expect(rsyncSpy.flags).toHaveBeenCalled();
        expect(rsyncSpy.set).toHaveBeenCalled();
        expect(rsyncSpy.archive).toHaveBeenCalled();
        expect(rsyncSpy.compress).toHaveBeenCalled();
        expect(rsyncSpy.progress).toHaveBeenCalled();
        expect(rsyncSpy.source).toHaveBeenCalled();
        expect(rsyncSpy.destination).toHaveBeenCalled();
        expect(rsyncSpy.delete).toHaveBeenCalled();

        expect(rsyncSpy.flags).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.set).toHaveBeenCalledTimes(2);
        expect(rsyncSpy.archive).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.compress).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.progress).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.source).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.destination).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.delete).toHaveBeenCalledTimes(1);

        expect(rsyncSpy.flags).toHaveBeenCalledWith('v');
        expect(rsyncSpy.set).toHaveBeenCalledWith('stats');
        expect(rsyncSpy.set).toHaveBeenCalledWith('checksum');
        expect(rsyncSpy.source).toHaveBeenCalledWith(['spec']);
        expect(rsyncSpy.destination).toHaveBeenCalledWith("user@test.example.com:/path/to/test");

        rsync
            .run();

        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(7);
        expect(console.log).toHaveBeenCalledWith('Start transfer to "test" stage');
        expect(console.log).toHaveBeenCalledWith('rysnc options', undefined );
        expect(console.log).toHaveBeenCalledWith('rysnc sources', undefined);
        expect(console.log).toHaveBeenCalledWith('rysnc destination', undefined);
        expect(console.log).toHaveBeenCalledWith('deploy done', undefined, 1, 'cmd');
        expect(console.log).toHaveBeenCalledWith('stdout');
        expect(console.log).toHaveBeenCalledWith('stderr');
    });

    it("test without delete and verbose", function () {
        rsyncSpy.execute = function (cb, stdout, stderr) {
            cb({}, 1, 'cmd');
            const data1 = Buffer.from('stdout');
            const data2 = Buffer.from('stderr');
            stdout(data1);
            stderr(data2);
            return this;
        };
        cmd.setArgv({ prod: true, verbose: false });
        config = new transfer.config()
            .setCmd(cmd)
            .setConfig({
                dest: "user@prod.example.com:/path/to/prod",
                src: ['spec'],
                logfile: 'rsync.log',
                delete: false
            })
            .init();
        rsync = new transfer.rsync()
            .setConfig(config)
            .setUtil(utilSpy)
            .setRsync(rsyncSpy)
            .init()
            .setup();

        expect(rsyncSpy.flags).toHaveBeenCalled();
        expect(rsyncSpy.set).toHaveBeenCalled();
        expect(rsyncSpy.archive).toHaveBeenCalled();
        expect(rsyncSpy.compress).toHaveBeenCalled();
        expect(rsyncSpy.progress).toHaveBeenCalled();
        expect(rsyncSpy.source).toHaveBeenCalled();
        expect(rsyncSpy.destination).toHaveBeenCalled();

        expect(rsyncSpy.flags).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.set).toHaveBeenCalledTimes(2);
        expect(rsyncSpy.archive).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.compress).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.progress).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.source).toHaveBeenCalledTimes(1);
        expect(rsyncSpy.destination).toHaveBeenCalledTimes(1);

        expect(rsyncSpy.flags).toHaveBeenCalledWith('v');
        expect(rsyncSpy.set).toHaveBeenCalledWith('stats');
        expect(rsyncSpy.set).toHaveBeenCalledWith('checksum');
        expect(rsyncSpy.source).toHaveBeenCalledWith(['spec']);
        expect(rsyncSpy.destination).toHaveBeenCalledWith("user@prod.example.com:/path/to/prod");

        rsync
            .run();
            
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(4);
        expect(console.log).toHaveBeenCalledWith('Start transfer to "prod" stage');
        expect(console.log).toHaveBeenCalledWith('deploy failed', Object({  }) );
        expect(console.log).toHaveBeenCalledWith('stdout');
        expect(console.log).toHaveBeenCalledWith('stderr');
    });

    it("test run rsync without setup", function () {
        rsyncSpy.execute = function (cb, stdout, stderr) {
            cb({}, 1, 'cmd');
            const data1 = Buffer.from('stdout');
            const data2 = Buffer.from('stderr');
            stdout(data1);
            stderr(data2);
            return this;
        };
        cmd.setArgv({ prod: true, verbose: false });
        config = new transfer.config()
            .setCmd(cmd)
            .setConfig({
                dest: "user@dev.example.com:/path/to/dev",
                src: ['spec'],
                logfile: 'rsync.log',
                delete: false
            })
            .init();
        rsync = new transfer.rsync()
            .setConfig(config)
            .setRsync(realRsync)
            .init();

        try {
            rsync.run();
            fail("run rsync without setup : failed");
        } catch (err) {
            expect(err.message).toBe('Setup rsync command first');
        }
    });
});
