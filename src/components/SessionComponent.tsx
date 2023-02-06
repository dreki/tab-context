import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { TabList } from "./TabList";

interface SessionComponentProps {
    session: Session;
}
export const SessionComponent = observer(({ session }: SessionComponentProps) => {
    console.log(`> session.tabs:`);
    console.log(session.tabs);

    return (
        <div>
            <TabList tabs={session.tabs} />
        </div>
    );
});
