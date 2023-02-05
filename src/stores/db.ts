import localForage from "localforage";

localForage.config({
    name: "tab-context",
    storeName: "keyvaluepairs",
    version: 1.0,
    driver: localForage.LOCALSTORAGE,
});

/* interface IModel {
    // Default constructor
    new (): IModel;
} */

// Abstract class that all types must adhere to. Just has an ID.
export abstract class Model {
    id!: string;

    // Constructor
    // constructor(public id: string) { }
    // constructor() { }

    // Implement IModel constructor
    // constructor() {
        // makeAutoObservable(this);
    // }


    // Deserialization method
    /*
    static deserialize<T extends Model>(this: { new (): T }, input: any): T {
        const model = new this();
        Object.assign(model, input);
        return model;
    }
    */
}

// function deserialize<T extends Model>(t: { new (): T }, input: any): T {
// function deserialize<T extends Model>(t: typeof T , input: any): T {
function deserialize<T extends Model>(
    // `t` is the typeof any class that extends Model
    t: { new(): T },
    // `input` is the object to be deserialized
    input: any
) {
    // const model = new t()
    const model = new t();
    Object.assign(model, input);
    return model;
}

// class Session

export async function get<T extends Model>(key: string): Promise<T[] | null> {
    return await localForage.getItem(key) as T[];
}

// Allow fetching by key and generic type.
export async function get__DEPRECATED<T extends Model>(
    // type: { new (): T },

    // `type` is the type of the object to be deserialized
    type: { new (): T },
    // type: T,
    // type: Type[T],

    key: string,
    // filter?: { [key: string]: any }
): Promise<T[] | null> {
    // return localForage.getItem(key);

    // Get all items in the key
    // const allItems: T[] | null = await localForage.getItem<T[]>(key);
    const allItems: object[] | null = await localForage.getItem(key);
    if (!allItems) { return null; }

    // Use Model.deserialize to deserialize all items to be of type T
    return allItems.map(item => {
        // return (item as any).deserialize(item);
        // return Model.deserialize<T>(new T(), item);

        // return new type()
        return deserialize(type, item)

        // return deserialize<T>(item);
    });

    // return allItems.map(item => {
    //     return T.deserialize(item);
    // });

    // Deserialize all items to be of type T
    /*
    const deserializedItems: T[] = allItems.map(item => {
        const deserializedItem = new (this as any)() as T;
        Object.assign(deserializedItem, item);
        return deserializedItem;
    });
    */
    // return allItems;

    // Cast and return
    // return allItems as T[];

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





// TODO: Have `upsert`, `get`, etc, just work with objects, and use `deserialize` to convert them to specific types?



// Allow upserting an item by key and instance.
export async function upsert<T extends Model>(key: string, item: T): Promise<T | null> {
    // Get all items in the key. If there are no items in the key, set it to an empty array in local
    // storage.
    // let allItems: T[] | null = await get<T>(key);
    // let allItems: T[] | null = await get(item, key);
    // let allItems: T[] | null = await get(typeof item, key);
    
    // let allItems: T[] | null = await get<T>(typeof item, key);
    let allItems: T[] | null = await get(key);
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
