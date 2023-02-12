import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { ITab } from "../types/ITab";
import { SessionComponent } from "./SessionComponent";

interface SessionListProps {
    sessions: Session[] | null;
    onRestore: (tabs: ITab[]) => void;
}
export const SessionList = observer(
    ({ sessions, onRestore }: SessionListProps) => {
        if (!sessions) {
            return null;
        }
        return (
            <>
                {sessions.map((session, index) => {
                    return (
                        <SessionComponent
                            session={session}
                            onRestore={onRestore}
                            key={index}
                        />
                    );
                })}
            </>
        );
    }
);
