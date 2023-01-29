import { Tab } from "../stores/window";
import { TabComponent } from "./TabComponent";

interface TabListProps {
  tabs: Tab[];
}

export function TabList({ tabs }: TabListProps) {
  return (
    <div className="flex flex-row flex-wrap gap-1.5">
      {tabs.map((tab, index) => {
        return (
          <div key={index}>
            <TabComponent tab={tab} />
          </div>
        );
      })}
    </div>
  );
}
