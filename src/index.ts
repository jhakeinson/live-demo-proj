import { join } from "path";
import DB from "./db/index.js";
import AdminUser from "./db/models/admin-user.model.js";
import BaseUser from "./db/models/base-user.js";
import app from "./server.js";

app.listen(3000, () => {
    console.log(">  Server is running...");
    const file = join(process.cwd() + '/src/db/', 'db.json');
    DB.instance = DB.initialize(file);

    DB.instance.read().then(() => {
        console.log(">  Database is ready...");
    });
});
