import { ITab } from "../stores";
import { TabComponent } from "./TabComponent";

interface TabListProps {
  tabs: ITab[];
}

export function TabList({ tabs }: TabListProps) {
  return (
    <ul className="flex flex-row">
      {tabs.map((tab, index) => {
        return (
          <li key={index}>
            <TabComponent tab={tab} />
          </li>
        );
      })}
    </ul>
  );
}
