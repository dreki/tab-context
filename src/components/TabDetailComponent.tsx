import { useState } from "react";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
    key?: number;
    onClose?: Maybe<(tab: ITab) => void>;
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

    // `tabComponent` is either a component or null
    let tabComponent: Maybe<JSX.Element> = null;
    // if onClose is defined, show tab actions
    if (onClose) {
        tabComponent = (
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
        );
    }
    // if onClose is not defined, don't show tab actions
    if (!onClose) {
        tabComponent = (
            <div className="grow">
                <label tabIndex={0}>{tab.title}</label>
            </div>
        );
    }

    return (
        <li
            className="flex h-6 items-center space-x-3 p-2 text-sm hover:rounded hover:bg-gray-50"
            key={key}
            onMouseEnter={() => onClose && setShowDropdown(true)}
            onMouseLeave={() => onClose && setShowDropdown(false)}
        >
            <FavIconWithDefault tab={tab} className={"h-5 w-5 flex-shrink-0"} />
            {tabComponent}
        </li>
    );
}
