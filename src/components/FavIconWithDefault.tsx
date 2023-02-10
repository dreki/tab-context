import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { ITab } from "../types/ITab";

interface IFavIconWithDefaultProps {
    tab: ITab;
    // Additional className
    className?: string;
}

export function FavIconWithDefault({
    tab,
    className = "",
}: IFavIconWithDefaultProps) {
    let favIconSrc: string | undefined = tab.favIconUrl;
    if (!favIconSrc) {
        return <GlobeAltIcon className={`inline-block h-4 w-4 ${className}`} />;
    }
    return (
        <img
            src={favIconSrc}
            alt="tab icon"
            className={`h-4 w-4 ${className} inline-block`}
        />
    );
}
