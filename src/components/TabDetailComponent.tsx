import { ITab } from "../types/ITab";

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
        <div>
            {tab.title}
        </div>
    );
}
