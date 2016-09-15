const rsynced = require('..');
const assert = require('assert');
const {inspect} = require('util');

describe('Rsynced', () => {
    it('Should create valid command', () => {
        var rsync = rsynced.create(process.cwd(), {
            user: 'user',
            host: 'localhost',
            owner: 'www-data',
            group: 'www-data',
            dest: '/tmp',
        });

        var args = rsync.args();

        assert.equal(args[2], '--owner=www-data', 'owner is set');
        assert.equal(args[3], '--group=www-data', 'group is set');
        assert.equal(args[4], '.', 'path is set');
        assert.equal(args[5], 'user@localhost:/tmp', 'destination is set');
    });
});
