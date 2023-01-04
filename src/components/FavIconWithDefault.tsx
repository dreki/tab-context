import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Tab } from "../stores/window";

export function FavIconWithDefault({ tab }: { tab: Tab }) {
  let favIconSrc: string | undefined = tab.favIconUrl;
  if (!favIconSrc) {
    return <GlobeAltIcon className="h-4 w-4" />;
  }
  return <img src={favIconSrc} alt="tab icon" className="h-4 w-4" />;
}
