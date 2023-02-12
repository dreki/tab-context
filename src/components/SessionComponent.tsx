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
        return (
            <div>
                <TabDetailList tabs={session.tabs} onRestore={onRestore} />
            </div>
        );
    }
);
