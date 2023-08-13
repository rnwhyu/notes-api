/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationsError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        const id = `user-${nanoid(16)}`;
        const hashedPW = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPW, fullname],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };
        const result = await this._pool.query(query);
        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }

    async getUserById(id) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }
        return result.rows[0];
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }
        const { id, password: hashedPW } = result.rows[0];
        const isMatched = await bcrypt.compare(password, hashedPW);
        if (!isMatched) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }
        return id;
    }
}

module.exports = UsersService;