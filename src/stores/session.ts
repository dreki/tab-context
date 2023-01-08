import { makeAutoObservable, observable } from 'mobx';
import { get, upsert } from './db';
import { v4 as uuidv4 } from 'uuid'

export class Tab {
    title: string;
    groupId: number;
    url: string;
    favIconUrl: string;

    constructor(title: string, groupId: number, url: string, favIconUrl: string) {
        this.title = title;
        this.groupId = groupId;
        this.url = url;
        this.favIconUrl = favIconUrl;
    }
}

/**
 * Session class. Represents a tab session.
 */
export class Session {
    // id is a unique identifier for the session
    id!: string;
    tabs: Tab[] = [];

    // static class-level `sessions` array
    // static sessions: Session[] = observable([]);

    constructor() {
        makeAutoObservable(this);
        console.log('> Session constructor called!');
        // If no id, create a new id
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    // Static class method for loading all sessions
    static async loadAll(): Promise<Session[] | null> {
        const sessions = await get<Session>('sessions');
        return sessions;
        // if (!sessions) {
        //     return;
        // }
        // Session.sessions = sessions;
    }

    /**
     * Save method. If the session has an id, update it. Otherwise, create a new session with a new unique ID.
     */
    async save() {
        await upsert<Session>('sessions', this);
    }

    // Allow adding a tab to the session
    addTab(tab: Tab) {
        this.tabs.push(tab);
    }
}
