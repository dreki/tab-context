import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { SessionComponent } from "./SessionComponent";

interface SessionListProps {
    sessions: Session[] | null;
}
export const SessionList = observer(({ sessions }: SessionListProps) => {
    if (!sessions) {
        return null;
    }
    return (
        <>
            {sessions.map((session, index) => {
                return <SessionComponent session={session} />;
            })}
        </>
    );
});
