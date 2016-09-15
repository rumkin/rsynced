const rsynced = require('..');
const assert = require('assert');
const {inspect} = require('util');

describe('Rsynced', () => {
    it('Should create valid command', () => {
        var rsync = rsynced.create(process.cwd(), {
            user: 'user',
            host: 'localhost',
            chown: ':www-data',
            dest: '/tmp',
        });

        var args = rsync.args();

        assert.equal(args[2], '--chown=:www-data', 'chown is set');
        assert.equal(args[3], '.', 'path is set');
        assert.equal(args[4], 'user@localhost:/tmp', 'destination is set');
    });
});
