import { ITab } from "../types/ITab";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
}

export function TabDetailComponent({ tab }: TabDetailComponentProps) {
    return (
        // <div className="flex flex-row flex-wrap gap-1.5">
        //     <div className="mr-1 flex h-6 w-9 items-center justify-center rounded-md bg-gray-300">
        //         <div className="text-sm text-gray-700">{tab.title}</div>
        //     </div>
        // </div>

        // <div className="rounded-md border border-indigo-400 p-1">
        //     <FavIconWithDefault tab={tab} />
        //     {tab.title}
        // </div>

        // Lay out a FavIconWithDefault to the left of tab.title.
        <div className="flex flex-row">
            <div>
                <FavIconWithDefault tab={tab} className={"align-middle"} />
            </div>
            <div>
                <div className="h-5 pl-1 align-middle">{tab.title}</div>
            </div>
        </div>
    );
}
