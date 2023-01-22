import localForage from "localforage";

localForage.config({
    name: "tab-context",
    storeName: "keyvaluepairs",
    version: 1.0,
    driver: localForage.LOCALSTORAGE,
});

// Abstract class that all types must adhere to. Just has an ID.
export abstract class Model {
    id!: string;
}

// class Session

// Allow fetching by key and generic type.
export async function get<T extends Model>(
    key: string,
    // filter?: { [key: string]: any }
): Promise<T[] | null> {
    return localForage.getItem(key);
    // const allItems: T[] | null = await localForage.getItem(key);
    // if (!allItems) { return null; }
    // if (!filter) { return allItems; }
    // return allItems.filter(item => {
    //     for (const [key, value] of Object.entries(filter)) {
    //         if (item[key] !== value) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}

// Allow fetching by key, ID, and generic type.
export async function find<T extends Model>(key: string, id: string): Promise<T | null> {
    // Get all items in the key
    const allItems: T[] | null = await localForage.getItem(key);
    if (!allItems) { return null; }
    return allItems.find(item => item.id === id) || null;
}

// Allow updating an item by key, ID, and instance.
// export async function update<T extends Model>(key: string, id: string, item: T): Promise<T | null> {
//     // Get all items in the key
//     // const allItems: T[] | null = await localForage.getItem(key);
//     const allItems: T[] | null = await get<T>(key);
//     if (!allItems) { return null; }
//     // Find the item to update
//     const itemToUpdate = allItems.find(item => item.id === id);
//     if (!itemToUpdate) { return null; }
//     // Update the item
//     Object.assign(itemToUpdate, item);
//     // Save the updated items
//     await localForage.setItem(key, allItems);
//     return itemToUpdate;
// }

// Allow upserting an item by key and instance.
export async function upsert<T extends Model>(key: string, item: T): Promise<T | null> {
    // Get all items in the key. If there are no items in the key, set it to an empty array in local
    // storage.
    let allItems: T[] | null = await get<T>(key);
    if (!allItems) {
        await localForage.setItem(key, []);
        allItems = [];
    }

    // Find the item to update
    const itemToUpdate = allItems.find(otherItem => otherItem.id === item.id);
    if (!itemToUpdate) {
        // Item does not exist, so add it
        allItems.push(item);
    } else {
        // Item exists, so update it
        Object.assign(itemToUpdate, item);
    }
    // Save the updated items
    await localForage.setItem(key, allItems);
    return item;
}
