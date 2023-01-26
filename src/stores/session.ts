import { makeAutoObservable, observable } from 'mobx';
import { get, upsert } from './db';
import { v4 as uuidv4 } from 'uuid'
import SparkMD5 from 'spark-md5';

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

// Enum for Session status
export enum SessionStatus {
    Active = 'active',
    Suspended = 'suspended',
    Archived = 'archived'
}

/**
 * Session class. Represents a tab session.
 */
export class Session {
    // id is a unique identifier for the session
    id!: string;
    // tabs: Tab[] = [];
    // status is the status of the session
    status: SessionStatus = SessionStatus.Active;

    // static class-level `sessions` array
    // static sessions: Session[] = observable([]);

    // `_tabs` should have getter/setter methods
    private _tabs: Tab[] = [];

    // Getter/setter for tabs
    get tabs(): Tab[] {
        return this._tabs;
    }

    set tabs(tabs: Tab[]) {
        this._tabs = tabs;
        // Set the ID to an MD5 hash of all of the tab URLs together.
        // This is a unique identifier for the session.
        const tabUrls = tabs.map((tab) => tab.url);
        console.log(tabUrls);
        const tabUrlsString = tabUrls.join('');
        this.id = SparkMD5.hash(tabUrlsString);
        console.log(`> new session id: ${this.id}`);
    }

    constructor(tabs: Tab[]) {
        makeAutoObservable(this);
        console.log('> Session constructor called!');
        // If no id, create a new id
        /*
        if (!this.id) {
            this.id = uuidv4();
        }
        */
        this.tabs = tabs;
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
     * Load all active sessions.
     */
    static async loadActive(): Promise<Session[] | null> {
        // const sessions: Session[] | null = await get<Session>('sessions', { status: SessionStatus.Active });
        const sessions: Session[] | null = await get<Session>('activeSessions');
        return sessions;
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
