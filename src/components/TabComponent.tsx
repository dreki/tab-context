import { ITab } from "../stores";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabComponentProps {
  tab: ITab;
}

export function TabComponent({ tab }: TabComponentProps) {
  return (
    <>
      <p>
        <FavIconWithDefault tab={tab} />
        {tab.title}
      </p>
    </>
  );
}
