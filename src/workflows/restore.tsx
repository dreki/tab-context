import { ITab } from "../types/ITab";

export async function restore(tabs: ITab[]) {
    console.log(`> restore()`);
    console.log(tabs);

    const urls = tabs.map((tab) => tab.url);

    console.log(`> urls:`);
    console.log(urls);

    // Create a window with all the tabs.
    
}
