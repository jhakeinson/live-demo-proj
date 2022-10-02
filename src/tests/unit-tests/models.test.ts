import AdminUser from "../../db/models/admin-user.model.js";
import BaseUser from "../../db/models/base-user.js";
import GuestUser from "../../db/models/guest-user.model.js";
import IntegrationHelpers from "../helpers/integrationn-helpers.js";

describe("User Model", () => {
    beforeAll(async () => {
        await IntegrationHelpers.startDB();
    });

    it('should create a new admin user object and save to db', async () => {
        const name = "Jhake Inson";
        const email = "my@email";
        const role = "admin";

        const user = new AdminUser(name, email);
        const result = await user.save();

        expect(user).toBeInstanceOf(BaseUser);
        expect(user).toBeInstanceOf(AdminUser);
        expect(typeof user.getId()).toBe("number");
        expect(user.name).toBe(name);
        expect(user.email).toBe(email);
        expect(user.role).toBe(role);
        expect(result).toBeTruthy();
    });

    it('should create a new guest user object and save to db', async () => {
        const name = "Jhweff Inson";
        const email = "your@email";
        const role = "guest";

        const user = new GuestUser(name, email);
        const result = await user.save();

        expect(user).toBeInstanceOf(BaseUser);
        expect(user).toBeInstanceOf(GuestUser);
        expect(typeof user.getId()).toBe("number");
        expect(user.name).toBe(name);
        expect(user.email).toBe(email);
        expect(user.role).toBe(role);
        expect(result).toBeTruthy();
    });

    it('should find a user from database', async () => {
        const name = "Dummy Test";
        const email = "test@email";
        const role = "admin";

        const user = new AdminUser(name, email);
        const result = await user.save();

        const foundUser = BaseUser.find(user.getId());

        expect(foundUser).toBeInstanceOf(BaseUser);
        expect(foundUser?.getId()).toBe(user.getId());
        expect(foundUser?.name).toBe(name);
        expect(foundUser?.email).toBe(email);
        expect(foundUser?.role).toBe(role);
    });

    it('should update a user from database', async () => {
        const name = "None Updated";
        const updatedName = "Update Dummy";
        const email = "test@email";
        const role = "admin";

        const user = new AdminUser(name, email);
        await user.save();

        const updatedUser = await user.update({
            name: updatedName
        }).save();

        expect(updatedUser?.id).toBe(user.getId());
        expect(updatedUser?.name).toBe(updatedName);
        expect(updatedUser?.email).toBe(email);
        expect(updatedUser?.role).toBe(role);
    });

    it('should delete a user from database', async () => {
        const name = "Delete Dummy";
        const email = "test@email";
        const role = "admin";

        const user = new AdminUser(name, email);
        await user.save();

        const id = user.getId();

        const deleteResult = await BaseUser.delete(id);
        const foundUser = await BaseUser.find(id);

        expect(typeof deleteResult).toBe('boolean');
        expect(deleteResult).toBe(true);
        expect(foundUser).toBeNull();
    });

    it('should fail to delete a user from database', async () => {
        const name = "Delete Dummy";
        const email = "test@email";
        const role = "admin";

        const user = new AdminUser(name, email);
        await user.save();

        const id = 2;

        const deleteResult = await BaseUser.delete(id);
        const foundUser = await BaseUser.find(user.getId());

        expect(typeof deleteResult).toBe('boolean');
        expect(deleteResult).toBe(false);
        expect(foundUser).toBeTruthy();
    });
});

