import * as express from 'express';
import { join } from 'path';
import DB from '../../db/index.js';
import app from '../../server.js';

export default class IntegrationHelpers {
    public static appInstance: express.Application;

    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        await this.startDB();
        this.appInstance = app;
        return this.appInstance;
    }

    static async startDB() {
        const file = join(process.cwd(), 'src/tests/test-db.json');
        DB.instance = DB.initialize(file);

        await DB.instance.read().then(async () => {
            DB.instance.data = {
                users: []
            }

            await DB.instance.write();
        });
    }
}