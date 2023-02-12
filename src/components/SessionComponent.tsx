import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { ITab } from "../types/ITab";
import { TabDetailList } from "./TabDetailList";

interface SessionComponentProps {
    session: Session;
    onRestore: (tabs: ITab[]) => void;
}
export const SessionComponent = observer(
    ({ session, onRestore }: SessionComponentProps) => {
        console.log(`> session.tabs:`);
        console.log(session.tabs);

        return (
            <div>
                <TabDetailList tabs={session.tabs} onRestore={onRestore} />
            </div>
        );
    }
);
