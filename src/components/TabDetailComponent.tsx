import { useState } from "react";
import { ITab } from "../types/ITab";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
    key?: number;
    onClose?: (tab: ITab) => void;
}

export function TabDetailComponent__DEP({ tab, key }: TabDetailComponentProps) {
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

export function TabDetailComponent({
    tab,
    key,
    onClose,
}: TabDetailComponentProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleOnClose = () => {
        if (onClose) {
            onClose(tab);
        }
    };

    return (
        <li
            className="flex h-6 items-center space-x-3 p-2 text-sm hover:rounded hover:bg-gray-50"
            key={key}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <FavIconWithDefault tab={tab} className={"h-5 w-5 flex-shrink-0"} />
            <div className="grow">
                <div className="dropdown-hover dropdown">
                    <label tabIndex={0}>{tab.title}</label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                    >
                        <li>
                            <a onClick={handleOnClose}>Close</a>
                        </li>
                        <li>
                            <a>Save as Resource</a>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    );
}
