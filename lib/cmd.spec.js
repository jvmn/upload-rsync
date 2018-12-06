const transfer = require('../index');

describe("cmd suite", function () {
    let cmd;

    beforeEach(function () {
        cmd = new transfer.cmd();
    });
    afterEach(function () {
        cmd = undefined;
    });

    it("test yargs default arguments", function () {
        expect(cmd.argv).toBeDefined();
        expect(cmd.argv).toEqual({ 
            _: [  ],
            prod: false,
            p: false,
            test: false,
            t: false,
            dev: false,
            d: false,
            verbose: false,
            v: false,
            $0: 'node_modules/.bin/jasmine'
        });
    });

    it("test argv setter", function () {
        cmd.setArgv({foo: "bar"});
        expect(cmd.argv).toEqual({foo: "bar"});
    });

    it("test stage getter", function () {
        expect(cmd.getStage()).toBe('dev');
        cmd.setArgv({test: true});
        expect(cmd.getStage()).toBe('test');
        cmd.setArgv({prod: true});
        expect(cmd.getStage()).toBe('prod');
    });

    it("test argv prod getter", function () {
        expect(cmd.getProd()).toBe(false);
        cmd.setArgv({prod: true});
        expect(cmd.getProd()).toBe(true);
    });

    it("test argv test getter", function () {
        expect(cmd.getTest()).toBe(false);
        cmd.setArgv({test: true});
        expect(cmd.getTest()).toBe(true);
    });

    it("test argv dev getter", function () {
        expect(cmd.getDev()).toBe(false);
        cmd.setArgv({dev: true});
        expect(cmd.getDev()).toBe(true);
    });

    it("test argv verbose getter", function () {
        expect(cmd.getVerbose()).toBe(false);
        cmd.setArgv({verbose: true});
        expect(cmd.getVerbose()).toBe(true);
    });
});
