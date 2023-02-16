import localForage from "localforage";

localForage.config({
    name: "tab-context",
    storeName: "keyvaluepairs",
    version: 1.0,
    driver: localForage.LOCALSTORAGE,
});

/**
 * Deserialize an object into a given type.
 * @param t Type of object to deserialize into
 * @param input Object to deserialize
 * @returns Deserialized object
 */
function deserialize<T extends Object, U extends Object>(
    t: { new (): T },
    input: U
): T {
    const instance = new t();
    Object.assign(instance, input);
    return instance;
}

/**
 * Deserialize an array of objects into an array of a given type.
 * @param t Type of object to deserialize into
 * @param input Array of objects to deserialize
 * @returns Array of deserialized objects
 */
function deserializeAll<T extends Object, U extends Object>(
    t: { new (): T },
    input: U[]
): T[] {
    return input.map((i) => deserialize(t, i));
}

/**
 * Load an item from local storage, deserializing it into a type.
 * @param key The key to get the item from.
 */
export async function get<T extends Object>(
    t: { new (): T },
    key: string
): Promise<T | null> {
    const itemJson: string | null = await localForage.getItem(key);
    if (!itemJson) {
        return null;
    }
    const itemObject: Object = JSON.parse(itemJson);
    return deserialize(t, itemObject);
}

/**
 * Load an array of items from local storage by key, deserializing them into a type.
 * @param t Type of object to deserialize into
 * @param key Key to get the item from
 * @returns Array of deserialized objects
 */
export async function getArray<T extends Object>(
    t: { new (): T },
    key: string
): Promise<T[] | null> {
    const itemJson: string | null = await localForage.getItem(key);
    if (!itemJson) {
        return null;
    }
    console.log("> getArray, itemJson:")
    console.log(itemJson)
    const itemObject: Object[] = JSON.parse(itemJson);
    return deserializeAll(t, itemObject);
}

/**
 * Set an item in local storage.
 * @param key The key to set the item to.
 * @param item The item to set. Will be serialized to JSON.
 */
export async function set<T extends Object>(key: string, item: T) {
    // await localForage.setItem(key, JSON.stringify(item));
    await localForage.setItem(key, item);
}

/**
 * Set an array of items in local storage.
 * @param key The key to set the item to.
 * @param item The array of items to set. Will be serialized to JSON.
 */
export async function setArray<T extends Object>(key: string, item: T[]) {
    // await localForage.setItem(key, JSON.stringify(item));
    await localForage.setItem(key, item);
}
