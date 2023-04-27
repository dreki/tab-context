import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { ITab } from "../types/ITab";
import { ArchivedSessionListItem } from "./ArchivedSessionListItem";

interface ArchivedSessionListProps {
    sessions: Session[] | null;
    onRestore: (session: Session) => void;
    onArchive?: (session: Session) => void;
}
export const ArchivedSessionList = observer(
    ({ sessions, onRestore, onArchive }: ArchivedSessionListProps) => {
        if (!sessions) {
            return null;
        }
        return (
            <>
                {sessions.map((session, index) => {
                    return (
                        <ArchivedSessionListItem
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
