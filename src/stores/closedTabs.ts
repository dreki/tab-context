import { makeAutoObservable } from "mobx";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { get, set } from "./db";

export class TabCollection {
    public windowIndex!: number;
    // Have a read-only `tabs` property.
    private _tabs: ITab[] = [];
    get tabs(): ITab[] {
        return this._tabs;
    }

    // Allow adding a tab to the collection.
    addTab(tab: ITab) {
        // Add tab to front of array.
        this._tabs.unshift(tab);
    }

    // Allow observing changes to the collection.

    // constructor(public tabs: ITab[]) {
    //     super();
    //     makeAutoObservable(this);
    // }
    constructor() {
        makeAutoObservable(this);
    }

    // Make a static async function to load closed tabs.
    public static async loadClosedTabs(windowIndex: number): Promise<TabCollection> {
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

    async save() {
        // Save the collection to local storage.
        await set(`closedTabs-${this.windowIndex}`, this);
    }
}


/**
 * Load nonvolatile list of closed tabs for a window, by index.
 * @param windowIndex Index of window to load closed tabs for.
 * @returns List of closed tabs for the window.
 */
// export async function loadClosedTabs(
//     windowIndex: number
// // ): Promise<TabCollection> {
// ): Promise<ITab[]> {
//     // return await upsert(TabCollection, `closedTabs-${windowIndex}`)

//     let collection: Maybe<ITab[]> = await get(Tab, `closedTabs-${windowIndex}`);

//     /*
//     // let tabs: Maybe<TabCollection> = await get<TabCollection>(TabCollection, `closedTabs-${windowIndex}`);
//     let collection: Maybe<TabCollection> = await find<TabCollection>(
//         TabCollection,
//         "closedTabs",
//         `${windowIndex}`
//     );
//     // If not found, create a new TabCollection.
//     if (!collection) {
//         collection = new TabCollection();
//         // await upsertToCollection(collection);

//     }
// */
//     // if (tabs) {
//     //     return tabs;
//     // }
//     // return new TabCollection([]);
// }
