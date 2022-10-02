import DB, { User } from "../index.js";
import AdminUser from "./admin-user.model.js";
import GuestUser from "./guest-user.model.js";

class BaseUser implements User {
    public name: String;
    public email: String;
    public role: String;
    private id: Number;

    constructor(name: String, email: String, role: String, id?: Number) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.id = id ?? Math.round(Math.random() * 10000);
    }

    public update(user: Partial<User>) {
        this.name = user.name ?? this.name;
        this.email = user.email ?? this.email;
        this.role = user.role ?? this.role;

        return this;
    }

    public async save() {
        const json = this.getJsonObject();
        const index = DB.instance.data?.users.findIndex(v => v.id === this.id) ?? -1;

        if (index >= 0) {
            DB.instance.data!.users[index] = json;
        } else {
            DB.instance.data!.users.push(json);
        }
        
        return await DB.instance.write()
            .then(() => json)
            .catch(() => null);
    }

    
    getId() {
        return this.id;
    }

    getJsonObject(): User & { id: Number } {
        return {
            email: this.email,
            name: this.name,
            role: this.role,
            id: this.id
        }
    }


    static async delete(id: Number) {
        const index = DB.instance.data?.users.findIndex(v => v.id === id) ?? -1;
        let result = false;
        if (index >= 0) {
            DB.instance.data!.users.splice(index, 1);
            result = await DB.instance.write()
                .then(() => true)
                .catch(() => false);
        }

        return result;
    }

    static find(id: Number) {
        const index = DB.instance.data?.users.findIndex(v => v.id === id) ?? -1;
        let result = null;
        if (index >= 0) {
            const found = DB.instance.data!.users[index];
            result = new BaseUser(found.name, found.email, found.role, found.id);
        }

        return result;
    }

    static getAll() {
        let result = DB.instance.data?.users ?? [];

        return result;
    }
}

export default BaseUser;