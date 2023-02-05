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

function deserialize<T extends Model>(t: { new (): T }, input: any) {
    const model = new t();
    Object.assign(model, input);
    return model;
}

function deserializeAll<T extends Model>(t: { new (): T }, input: any[]) {
    return input.map((i) => deserialize(t, i));
}


export async function get<T extends Model>(t: { new(): T }, key: string): Promise<T[] | null> {
    const item: T[] | null = await localForage.getItem(key);
    if (!item) {
        return null;
    }
    return deserializeAll(t, item);

    // return (await localForage.getItem(key)) as T[];
    /*
    let result: T[] | null = null;

    const item: T[] | null = await localForage.getItem<T[]>(key);
    if (item) {
        result = [];
        for (const i of item) {
            // result.push(deserialize(T, i));
            result.push(i as T);
            new T();
        }
    }
    return result;
    */
}
    
/* 
export async function get<T extends Model>(key: string): Promise<T[] | null> {
    // return (await localForage.getItem(key)) as T[];
    let result: T[] | null = null;

    const item: T[] | null = await localForage.getItem<T[]>(key);
    if (item) {
        result = [];
        for (const i of item) {
            // result.push(deserialize(T, i));
            result.push(i as T);
            new T();
        }
    }
    return result;
}

 */


// Allow fetching by key, ID, and generic type.
export async function find<T extends Model>(
    t: { new(): T },
    key: string,
    id: string
): Promise<T | null> {
    // Get all items in the key
    const allItems: T[] | null = await get(t, key);
    if (!allItems) {
        return null;
    }
    return allItems.find((item) => item.id === id) || null;
}



// Allow upserting an item by key and instance.
export async function upsert<T extends Model>(t: { new(): T }, key: string, item: T): Promise<T | null> {
    // Get all items in the key. If there are no items in the key, set it to an empty array in local
    // storage.
    let allItems: T[] | null = await get(t, key);
    if (!allItems) {
        await localForage.setItem(key, []);
        allItems = [];
    }

    // Find the item to update
    const itemToUpdate = allItems.find((otherItem) => otherItem.id === item.id);
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
