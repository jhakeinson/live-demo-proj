import BaseUser from "./base-user.js";

class AdminUser extends BaseUser {
    constructor(name: String, email: String, id?: Number) {
        super(name, email, "admin", id);
    }
}

export default AdminUser;