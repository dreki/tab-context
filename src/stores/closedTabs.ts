import { makeAutoObservable } from "mobx";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { get } from "./db";

class TabCollection {
    // Have a read-only `tabs` property.
    private _tabs: ITab[] = [];
    get tabs(): ITab[] {
        return this._tabs;
    }

    // Allow adding a tab to the collection.
    addTab(tab: ITab) {
        this._tabs.push(tab);
    }

    // Allow observing changes to the collection.

    // constructor(public tabs: ITab[]) {
    //     super();
    //     makeAutoObservable(this);
    // }
    constructor() {
        makeAutoObservable(this);
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
