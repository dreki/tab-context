import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { TabDetailList } from "./TabDetailList";

interface SessionComponentProps {
    session: Session;
}
export const SessionComponent = observer(
    ({ session }: SessionComponentProps) => {
        console.log(`> session.tabs:`);
        console.log(session.tabs);

        return (
            <div>
                <TabDetailList tabs={session.tabs} />
            </div>
        );
    }
);
