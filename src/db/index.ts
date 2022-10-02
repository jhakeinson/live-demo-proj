import { Low, JSONFile } from 'lowdb';

export type User = {
    name: String,
    email: String,
    role: String
}

type Data = {
    users: (User & { id: Number})[]
}

export default class DB {
    static instance: Low<Data>;

    private constructor() {}

    static initialize(file: string) {
        const adapter = new JSONFile<Data>(file);
        return new Low(adapter);
    }
}
