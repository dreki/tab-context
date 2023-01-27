import { makeAutoObservable, observable } from "mobx";
import SparkMD5 from "spark-md5";
import { get, upsert } from "./db";

export class Tab {
    title: string;
    groupId: number;
    url: string;
    favIconUrl: string;

    constructor(
        title: string,
        groupId: number,
        url: string,
        favIconUrl: string
    ) {
        this.title = title;
        this.groupId = groupId;
        this.url = url;
        this.favIconUrl = favIconUrl;
    }
}

// Enum for Session status
export enum SessionStatus {
    Active = "active",
    Suspended = "suspended",
    Archived = "archived",
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
        const tabUrlsString = tabUrls.join("");
        this.id = SparkMD5.hash(tabUrlsString);
        console.log(`> new session id: ${this.id}`);
    }

    constructor(tabs: Tab[]) {
        makeAutoObservable(this);
        this.tabs = tabs;
    }

    // Allow adding a tab to the session
    addTab(tab: Tab) {
        this.tabs.push(tab);
    }
}

/**
 * Manages access to sessions data.
 */
export class SessionStore {
    sessions: Session[] = observable([]);

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Load all sessions.
     *
     * Important: This method must be called upon construction, or after any changes to the sessions
     * array (e.g. via `save`).
     */
    async loadAll() {
        const sessions = await get<Session>("sessions");
        if (!sessions) {
            return;
        }
        // return sessions;
        this.sessions = sessions;

        // if (!sessions) {
        //     return;
        // }
        // Session.sessions = sessions;
    }

    /**
     * Load all active sessions.
     * @deprecated
     */
    static async loadActive(): Promise<Session[] | null> {
        // const sessions: Session[] | null = await get<Session>('sessions', { status: SessionStatus.Active });
        const sessions: Session[] | null = await get<Session>("activeSessions");
        return sessions;
    }

    /**
     * Save a session. If it already exists, update it. Otherwise, create a new session.
     *
     * Note that you'll have to call `loadAll` again to update the sessions array after calling this
     * method.
     * @param session Session to save
     */
    async save(session: Session) {
        await upsert<Session>("sessions", session);
    }
}
