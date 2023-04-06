import { makeAutoObservable } from "mobx";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { get, set } from "./db";

export class TabCollection {
    public windowIndex!: number;

    private _tabs: ITab[] = [];
    get tabs(): ITab[] {
        return this._tabs;
    }

    /**
     * Add a tab to the collection.
     * @param tab  Tab to add to the collection.
     */
    addTab(tab: ITab) {
        // If tab is already in the collection, return. Based on title and URL.
        if (
            this._tabs.find((t) => t.title === tab.title && t.url === tab.url)
        ) {
            return;
        }

        // Add tab to front of array.
        this._tabs.unshift(tab);
    }

    /**
     * Constructor.
     */
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Load the TabCollection for the given window, by window index. If not found in storage, a new
     * TabCollection will be created.
     * @param windowIndex  Window index
     * @returns  TabCollection for the given window.
     */
    public static async loadClosedTabs(
        windowIndex: number
    ): Promise<TabCollection> {
        let collection: Maybe<TabCollection> = await get(
            TabCollection,
            `closedTabs-${windowIndex}`
        );

        // If not found, create a new TabCollection.
        if (!collection) {
            collection = new TabCollection();
            collection.windowIndex = windowIndex;
        }

        return collection;
    }

    /**
     * Save the TabCollection to storage.
     */
    async save() {
        // Save the collection to local storage.
        await set(`closedTabs-${this.windowIndex}`, this);
    }
}
