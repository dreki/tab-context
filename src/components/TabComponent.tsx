import { Tab } from "../stores/window";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabComponentProps {
  tab: Tab;
}

export function TabComponent({ tab }: TabComponentProps) {
  return (
    <>
      {/* A w-6 h-6 circle. Center the image inside of it. */}
      {/* <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
        <FavIconWithDefault tab={tab} />
      </div> */}

      {/* rounded-md rectangles. h-6 w-9.*/}
      <div className="mr-1 flex h-6 w-9 items-center justify-center rounded-md bg-gray-300">
        {/* <div className="text-sm text-gray-700">{tab.title}</div> */}
        {/* <div className="ml-2 mr-2"> */}
        <FavIconWithDefault tab={tab} />
        {/* </div> */}
      </div>
    </>
  );
}
