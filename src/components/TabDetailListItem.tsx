import { observer } from "mobx-react";
import { useState } from "react";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
    key?: number;
    onClose?: Maybe<(tab: ITab) => void>;
}

/**
 * Converts a tab group color to a tailwind background color class.
 *
 * @param color The color of the tab group. This is a string like "blue" or
 *   "red".
 * @returns The tailwind background color class. If the color is null or empty,
 *   returns an empty string.
 */
function tabGroupColorToTailwindBackgroundColor(color: Maybe<string>): string {
    if (!color || color === "") {
        return "";
    }
    // Change "grey" to "gray" because tailwind uses "gray".
    if (color === "grey") {
        color = "gray";
    }
    return `bg-${color}-300`;
}

export const TabDetailListItem = observer(function TabDetailListItem({
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
                    <label tabIndex={0} className="line-clamp-1">
                        {tab.title}
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                    >
                        <li>
                            <a onClick={handleOnClose}>Close</a>
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
                <label tabIndex={0} className="line-clamp-1">
                    {tab.title}
                </label>
            </div>
        );
    }

    let tabGroupBadge: Maybe<JSX.Element> = null;
    // const tabGroupColorClass = tabGroupColorToTailwindBackgroundColor(
    //     tab.groupColor || null
    // );
    // If we have a group with at least a color, show a badge.
    if (tab.groupColor) {
        const color = tab.groupColor;
        tabGroupBadge = (
            <span
                className={`badge border-none bg-${color}-100 text-${color}-800`}
            >
                {tab.groupName}
            </span>
        );
    }

    return (
        <li
            className={`flex h-6 items-center space-x-3 p-2 text-sm hover:rounded`}
            key={key}
            onMouseEnter={() => onClose && setShowDropdown(true)}
            onMouseLeave={() => onClose && setShowDropdown(false)}
        >
            <FavIconWithDefault tab={tab} className={"h-5 w-5 flex-shrink-0"} />
            {tabGroupBadge}
            {tabComponent}
        </li>
    );
});
