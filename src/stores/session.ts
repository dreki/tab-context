import { makeAutoObservable, observable } from "mobx";
import SparkMD5 from "spark-md5";
import { ITab } from "../types/ITab";
import { getArray, set } from "./db";
import { log } from "console";

export class Tab implements ITab {
    // Constructor that defines public properties, based on ITab interface
    constructor(
        public id: number,
        public title: string,
        public pinned: boolean,
        public url: string,
        public groupName?: string,
        public groupColor?: string,
        public favIconUrl?: string
    ) {
        makeAutoObservable(this);
    }
}

// Enum for Session status
export enum SessionStatus {
    Active = "active",
    // Suspended = "suspended",
    Archived = "archived",
}

/**
 * Session class. Represents a tab session.
 */
export class Session {
    // id is a unique identifier for the session
    id!: string;

    name: string = "";

    // tabs: Tab[] = [];
    // status is the status of the session
    status: SessionStatus = SessionStatus.Active;

    // static class-level `sessions` array
    // static sessions: Session[] = observable([]);

    createdAt: Date = new Date();

    // `_tabs` should have getter/setter methods
    private _tabs: ITab[] = [];

    // Getter/setter for tabs
    get tabs(): ITab[] {
        return this._tabs;
    }

    set tabs(tabs: ITab[]) {
        this._tabs = tabs;
        // Set the ID to an MD5 hash of all of the tab URLs together.
        // This is a unique identifier for the session.
        const tabUrls = tabs.map((tab) => tab.url);
        console.log(tabUrls);
        const tabUrlsString = tabUrls.join("");
        this.id = SparkMD5.hash(tabUrlsString);
        // console.log(`> new session id: ${this.id}`);
    }

    // constructor(tabs: Tab[]) {
    //     makeAutoObservable(this);
    //     this.tabs = tabs;
    // }
    constructor() {
        makeAutoObservable(this);
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

    activeSessions: Session[] = observable([]);
    archivedSessions: Session[] = observable([]);

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
        // const sessions = await get<Session>("sessions");
        const sessions = await getArray(Session, "sessions");
        if (!sessions) {
            return;
        }
        // `this.sessions` should be all Active sessions
        this.activeSessions = sessions.filter((s) => s.status === SessionStatus.Active);
        // `this.archivedSessions` should be all Archived sessions
        this.archivedSessions = sessions.filter(
            (s) => s.status === SessionStatus.Archived
        );
    }

    /**
     * Save a session. If it already exists, update it. Otherwise, create a new session.
     *
     * Note that you'll have to call `loadAll` again to update the sessions array after calling this
     * method.
     * @param session Session to save
     */
    async save(session: Session): Promise<void> {
        // await upsert(Session, "sessions", session);
        // await set("sessions", )
        
        // Update this.sessions with the new session
        const index = this.activeSessions.findIndex((s) => s.id === session.id);
        if (index >= 0) {
            console.log(`> updating session ${session.id}`);
            console.log(session);
            
            this.activeSessions[index] = session;
        }
        if (index < 0) {
            console.log(`> adding session ${session.id}`);
            // Add session to the front of the array, so that it's the first session in the list.
            this.activeSessions.unshift(session);
        }
        // Save the sessions array
        await set("sessions", this.activeSessions);
    }
}
