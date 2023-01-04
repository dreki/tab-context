import { Tab } from "../stores/window";
import { TabComponent } from "./TabComponent";

interface TabListProps {
  tabs: Tab[];
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
