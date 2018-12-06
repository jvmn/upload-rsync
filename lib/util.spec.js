const util = require('./util');
const fs = require("fs");

describe("util suite", function () {

    it("test checkDestination", function () {
        try {
            util.checkDestination();
            fail("Destination is undefined failed");
        } catch (err) {
            expect(err.message).toBe('The configured destination "undefined" failed regex check');
        }
        try {
            util.checkDestination('');
            fail("Destination is empty failed");
        } catch (err) {
            expect(err.message).toBe('The configured destination "" failed regex check');
        }
        try {
            util.checkDestination('foo');
            fail("Destination is some sting failed");
        } catch (err) {
            expect(err.message).toBe('The configured destination "foo" failed regex check');
        }
        try {
            util.checkDestination('userdev.example.com:/path/to/dev');
            fail("Destination without @ failed");
        } catch (err) {
            expect(err.message).toBe('The configured destination "userdev.example.com:/path/to/dev" failed regex check');
        }
        try {
            util.checkDestination('user@dev.example.com/path/to/dev');
            fail("Destination without : failed");
        } catch (err) {
            expect(err.message).toBe('The configured destination "user@dev.example.com/path/to/dev" failed regex check');
        }
        expect(util.checkDestination('user@dev.example.com:/path/to/dev')).toBe(true);
    });

    it("test checkSrc", function () {
        try {
            util.checkSrc();
            fail("Src is undefined failed");
        } catch (err) {
            expect(err.message).toBe('Please set src config param');
        }
        try {
            util.checkSrc('');
            fail("Src is empty failed");
        } catch (err) {
            expect(err.message).toBe('Please set src config param');
        }
        try {
            util.checkSrc('foo');
            fail("Src is some sting failed");
        } catch (err) {
            expect(err.message).toBe('Please set src config param as array');
        }
        try {
            util.checkSrc([]);
            fail("Src is empty array failed");
        } catch (err) {
            expect(err.message).toBe('Src config param is empty');
        }
        try {
            util.checkSrc(['', 'foo']);
            fail("Src has empty sting failed");
        } catch (err) {
            expect(err.message).toBe('Dirname in src config param is empty');
        }
        try {
            util.checkSrc(['foo']);
            fail("Src has non existent dir failed");
        } catch (err) {
            expect(err.message).toEqual(jasmine.stringMatching(/Dirname .+ not found/));
        }
        expect(util.checkSrc(['spec'])).toBe(true);
    });

    it("test logToFile", function () {
        expect(util.logToFile()).toBe(false);
        expect(util.logToFile('')).toBe(false);
    });

    it("test clearFile and logToFile", function () {
        expect(util.clearFile()).toBe(false);
        expect(util.clearFile('')).toBe(false);

        if (util.isFile('spec/artifacts/rsync.log')) {
            fs.unlinkSync('spec/artifacts/rsync.log');
        }
        if (util.isDir('spec/artifacts')) {
            fs.rmdirSync('spec/artifacts', { recursive: true });
        }
        fs.mkdirSync('spec/artifacts', { recursive: true });

        expect(util.logToFile('spec/artifacts/rsync.log', 'foo')).toBe(true);
        expect(fs.readFileSync('spec/artifacts/rsync.log').toString()).toBe('foo');
        expect(util.clearFile('spec/artifacts/rsync.log')).toBe(true);
        expect(fs.readFileSync('spec/artifacts/rsync.log').toString()).toBe('');
        expect(util.logToFile('spec/artifacts/rsync.log', 'bar')).toBe(true);
        expect(fs.readFileSync('spec/artifacts/rsync.log').toString()).toBe('bar');

        fs.unlinkSync('spec/artifacts/rsync.log');
        fs.rmdirSync('spec/artifacts');
    });

    it("test isDir", function () {
        expect(util.isDir()).toBe(false);
        expect(util.isDir('')).toBe(false);
        expect(util.isDir('foo')).toBe(false);
        expect(util.isDir('package.json')).toBe(false);
        expect(util.isDir('spec')).toBe(true);
    });

    it("test isFile", function () {
        expect(util.isFile()).toBe(false);
        expect(util.isFile('')).toBe(false);
        expect(util.isFile('foo')).toBe(false);
        expect(util.isFile('spec')).toBe(false);
        expect(util.isFile('package.json')).toBe(true);
    });

    it("test canReadAndWriteFile", function () {
        expect(util.canReadAndWriteFile()).toBe(false);
        expect(util.canReadAndWriteFile('')).toBe(false);
        expect(util.canReadAndWriteFile('spec')).toBe(false);
        expect(util.canReadAndWriteFile('foo')).toBe(true);
        expect(util.canReadAndWriteFile('package.json')).toBe(true);

        if (util.isFile('spec/artifacts/rsync.log')) {
            fs.unlinkSync('spec/artifacts/rsync.log');
        }
        if (util.isDir('spec/artifacts')) {
            fs.rmdirSync('spec/artifacts', { recursive: true });
        }
        fs.mkdirSync('spec/artifacts', { recursive: true });

        expect(util.canReadAndWriteFile('spec/artifacts/rsync.log')).toBe(true);
        fs.chmodSync('spec/artifacts', 0o444)
        expect(util.canReadAndWriteFile('spec/artifacts/rsync.log')).toBe(false);

        fs.rmdirSync('spec/artifacts');
    });

    it("test canReadAndWriteFile", function () {
        expect(util.canReadAndWriteFile()).toBe(false);
        expect(util.canReadAndWriteFile('')).toBe(false);
        expect(util.canReadAndWriteFile('spec')).toBe(false);
        expect(util.canReadAndWriteFile('foo')).toBe(true);
        expect(util.canReadAndWriteFile('package.json')).toBe(true);

        if (util.isFile('spec/artifacts/rsync.log')) {
            fs.unlinkSync('spec/artifacts/rsync.log');
        }
        if (util.isDir('spec/artifacts')) {
            fs.rmdirSync('spec/artifacts', { recursive: true });
        }
        fs.mkdirSync('spec/artifacts', { recursive: true });

        expect(util.canReadAndWriteFile('spec/artifacts/rsync.log')).toBe(true);
        fs.chmodSync('spec/artifacts', 0o444)
        expect(util.canReadAndWriteFile('spec/artifacts/rsync.log')).toBe(false);

        fs.rmdirSync('spec/artifacts');
    });

    it("test readJsonFile", function () {
        expect(util.readJsonFile()).toBeNull();
        expect(util.readJsonFile('')).toBeNull();
        try {
            util.readJsonFile('foo');
            fail("File not found failed");
        } catch (err) {
            expect(err.message).toEqual(jasmine.stringMatching(/No such file/));
        }
        try {
            util.readJsonFile('index.js');
            fail("File is no JsonFile failed");
        } catch (err) {
            expect(err.message).toEqual(jasmine.stringMatching(/in JSON at position/));
        }
        expect(util.readJsonFile('spec/resources/upload-rsync.config.json')).toEqual({
            "stage": {
                "dev": {
                    "dest": "user@dev.example.com:/path/to/dev",
                    "src": [
                        "spec",
                        "lib"
                    ],
                    "delete": false
                },
                "test": {
                    "dest": "user@test.example.com:/path/to/test",
                    "src": [
                        "spec",
                        "lib"
                    ],
                    "delete": true
                },
                "prod":{
                    "dest": "user@prod.example.com:/path/to/prod",
                    "src": [
                        "spec",
                        "lib"
                    ],
                    "delete": false
                }
            },
            "logfile": "rsync.log"
        });
    });
});
