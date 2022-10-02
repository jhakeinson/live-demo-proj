import BaseUser from "./base-user.js";

class GuestUser extends BaseUser {
    constructor(name: String, email: String, id?: Number) {
        super(name, email, "guest", id);
    }
}

export default GuestUser;