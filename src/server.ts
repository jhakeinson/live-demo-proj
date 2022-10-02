import express, { Express, Request, Response} from "express";
import cors from 'cors';
import BaseUser from "./db/models/base-user.js";
import GuestUser from "./db/models/guest-user.model.js";
import AdminUser from "./db/models/admin-user.model.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

// Get all users
app.get('/users', async (req: Request, res: Response) => {
    const users = BaseUser.getAll();

    return res.status(200).json(users);
});

// Create a user
app.post('/users', async (req: Request, res: Response) => {
    const body = req.body;
    let user: BaseUser | null = null;

    if (!body?.name || !body?.email || !body?.role) {
        return res.status(400).send("Invalid request body.");
    }

    switch(body.role) {
        case 'admin':
            user = new AdminUser(body.name, body.email);
            break;
        case 'guest':
            user = new GuestUser(body.name, body.email);
            break;
        default:
            break;
    }

    if (!(await user?.save().catch(() => false))) {
        return res.status(500).send('Something went wrong.');
    }

    return res.status(201).send('User creation successful.');
});

// Update a user
app.put('/users/:id', async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;

    if (!body.name && !body.email && !body.role) {
        return res.status(400).send("Invalid request body.");
    }

    const user = await BaseUser.find(Number(id))

    if (!user) {
        return res.status(404).send('User not found.');
    }

    if (!(await user.update(body).save().catch(() => false))) {
        return res.status(500).send('Something went wrong.');
    }

    return res.status(200).send('User updated successful.');
});

// Delete a user
app.delete('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
        return res.status(400).send("'id' is not valid." );
    }

    const result = await BaseUser.delete(Number(id)).catch(() => false);

    if (!result) {
        return res.status(200).send('No record is deleted.');
    }

    return res.status(200).send('User deletion successful.');
});

// Get a user
app.get('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
        return res.status(400).send("'id' is not valid." );
    }

    const user = BaseUser.find(Number(id));

    if (!user) {
        return res.status(404).send("Not Found.");
    }

    res.status(200).json(user.getJsonObject());
});


export default app;