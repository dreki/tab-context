import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { ITab } from "../types/ITab";
import { SessionListItem } from "./SessionListItem";

interface SessionListProps {
    sessions: Session[] | null;
    // onRestore: (tabs: ITab[]) => void;
    onRestore: (session: Session) => void;
    onArchive?: (session: Session) => void;
}
export const SessionList = observer(
    ({ sessions, onRestore, onArchive }: SessionListProps) => {
        if (!sessions) {
            return null;
        }
        return (
            <>
                {sessions.map((session, index) => {
                    return (
                        <SessionListItem
                            session={session}
                            onRestore={onRestore}
                            onArchive={onArchive}
                            key={index}
                        />
                    );
                })}
            </>
        );
    }
);
