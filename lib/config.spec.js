const transfer = require('../index');

var path = require('path');
var rootPath = path.resolve(path.dirname(__dirname));

describe("config suite", function () {
    let cmd;
    let config;

    beforeEach(function () {
        cmd = new transfer.cmd({ 
            _: [  ],
            prod: false,
            p: false,
            test: false,
            t: false,
            dev: false,
            d: false,
            verbose: false,
            v: false,
            yes: false,
            y: false,
            $0: 'node_modules/.bin/jasmine'
        });
        config = new transfer.config(cmd)
            .init();
    });
    afterEach(function () {
        cmd = undefined;
        config = undefined;
    });

    it("test config default arguments", function () {
        expect(config.stage).toBe("dev");
        expect(config.debug).toBe(false);

        cmd = new transfer.cmd({test: true, verbose: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.stage).toBe("test");
        expect(config.debug).toBe(true);

        cmd = new transfer.cmd({prod: true, verbose: false});
        config = new transfer.config(cmd)
            .init();
        expect(config.stage).toBe("prod");
        expect(config.debug).toBe(false);

        expect(config.cmd).toEqual(cmd);
    });

    it("test config selection by stage", function () {
        const configJsonFilename = rootPath + "/spec/resources/upload-rsync.config.json";
        expect(config.readConfig(
            configJsonFilename
        )).toEqual(
            {
                "dest": "user@dev.example.com:/path/to/dev",
                "src": [
                    "spec",
                    "lib"
                ],
                "delete": false,
                "logfile": "rsync.log"
            }
        );

        cmd = new transfer.cmd({test: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.readConfig(
            configJsonFilename, "test"
        )).toEqual(
            {
                "dest": "user@test.example.com:/path/to/test",
                "src": [
                    "spec",
                    "lib"
                ],
                "delete": true,
                "logfile": "rsync.log"
            }
        );
        
        cmd = new transfer.cmd({prod: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.readConfig(
            configJsonFilename, "prod"
        )).toEqual(
            {
                "dest": "user@prod.example.com:/path/to/prod",
                "src": [
                    "spec",
                    "lib"
                ],
                "delete": false,
                "logfile": "rsync.log"
            }
        );
    });

    it("test config setter", function () {
        config.setConfig({foo: "bar"});
        expect(config.config).toEqual({foo: "bar"});
    });

    it("test stage getter", function () {
        expect(config.getStage()).toBe("dev");

        cmd = new transfer.cmd({test: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.getStage()).toBe("test");

        cmd = new transfer.cmd({prod: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.getStage()).toBe("prod");
    });

    it("test dest getter", function () {
        expect(config.getDest()).toBeUndefined();

        config.setConfig({dest: "foo"});
        expect(config.getDest()).toBe("foo");
    });

    it("test src getter", function () {
        expect(config.getSrc()).toBeUndefined();

        config.setConfig({src: "foo"});
        expect(config.getSrc()).toBe("foo");
    });

    it("test delete getter", function () {
        expect(config.getDelete()).toBeUndefined();

        config.setConfig({delete: "foo"});
        expect(config.getDelete()).toBe("foo");
    });

    it("test debug getter", function () {
        expect(config.getDebug()).toBe(false);

        cmd = new transfer.cmd({verbose: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.getDebug()).toBe(true);

        cmd = new transfer.cmd({verbose: false});
        config = new transfer.config(cmd)
            .init();
        expect(config.getDebug()).toBe(false);
    });

    it("test logfile getter", function () {
        expect(config.getLogfile()).toBeUndefined();

        config.setConfig({logfile: "foo"});
        expect(config.getLogfile()).toBe("foo");
    });

    it("test executeWithoutPrompt getter", function () {
        expect(config.executeWithoutPrompt()).toBe(false);

        cmd = new transfer.cmd({yes: true});
        config = new transfer.config(cmd)
            .init();
        expect(config.executeWithoutPrompt()).toBe(true);

        cmd = new transfer.cmd({yes: false});
        config = new transfer.config(cmd)
            .init();
        expect(config.executeWithoutPrompt()).toBe(false);
    });
});
