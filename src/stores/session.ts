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
    // Singleton instance
    static instance: SessionStore;

    sessions: Session[] = observable([]);

    private constructor() {
        makeAutoObservable(this);
        this.loadSessions();
    }

    /**
     * Get the singleton instance of SessionStore.
     * @returns Singleton instance of SessionStore
     */
    static getInstance(): SessionStore {
        if (!SessionStore.instance) {
            SessionStore.instance = new SessionStore();
        }
        return SessionStore.instance;
    }

    /**
     * Load all sessions.
     *
     * Important: This method must be called upon construction, or after any changes to the sessions
     * array (e.g. via `save`).
     */
    async loadSessions() {
        const sessions = await get<Session>("sessions");
        if (!sessions) {
            return;
        }
        this.sessions = sessions;
    }

    /**
     * Save a session. If it already exists, update it. Otherwise, create a new session.
     *
     * Note that you'll have to call `loadAll` again to update the sessions array after calling this
     * method.
     * @param session Session to save
     */
    async save(session: Session): Promise<void> {
        await upsert<Session>("sessions", session);
    }
}
