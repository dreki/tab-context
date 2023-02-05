import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { ITab } from "../types/ITab";

export function FavIconWithDefault({ tab }: { tab: ITab }) {
  let favIconSrc: string | undefined = tab.favIconUrl;
  if (!favIconSrc) {
    return <GlobeAltIcon className="h-4 w-4" />;
  }
  return <img src={favIconSrc} alt="tab icon" className="h-4 w-4" />;
}
