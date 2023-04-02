import { useState } from "react";
import { ITab } from "../types/ITab";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
    key?: number;
}

export function TabDetailComponent({ tab, key }: TabDetailComponentProps) {
    // useState for whether to show tab actions
    const [showTabActions, setShowTabActions] = useState(false);

    const closeIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-4 w-4 stroke-white"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
            ></path>
        </svg>
    );

    const tabActions = (
        <>
            <button className="btn-error btn-xs btn-circle btn">
                {closeIcon}
            </button>
        </>
    );

    return (
        <li
            className="flex h-6 items-center space-x-3 hover:bg-gray-50"
            key={key}
            // When mouse enters, show tab actions
            onMouseEnter={() => setShowTabActions(true)}
            // When mouse leaves, hide tab actions
            onMouseLeave={() => setShowTabActions(false)}
        >
            <FavIconWithDefault tab={tab} className={"h-5 w-5 flex-shrink-0"} />
            <div className="grow">{tab.title}</div>
            {/* If showTabActions is true, show tab actions */}
            {showTabActions && <div>{tabActions}</div>}
        </li>
    );
}
