import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { ITab } from "../types/ITab";
import { TabDetailList } from "./TabDetailList";

interface SessionListItemProps {
    session: Session;
    // onRestore: (tabs: ITab[]) => void;
    onRestore: (session: Session) => void;
    onArchive?: (session: Session) => void;
}

export const SessionListItem = observer(
    ({ session, onRestore, onArchive }: SessionListItemProps) => {
        const name = session.name ? session.name : "(Unnamed)";

        let tabCreated: JSX.Element | null = null;

        tabCreated = (
            <span className="ml-2 text-gray-500">
                <>{session.relativeCreatedAt}</>
            </span>
        );

        const restore: JSX.Element | null = onRestore ? (
            <button
                className="btn-primary btn-sm btn"
                onClick={() => onRestore(session)}
            >
                Restore
            </button>
        ) : null;

        const archive: JSX.Element | null = onArchive ? (
            <button
                className="btn-outline btn-ghost btn-sm btn"
                onClick={() => onArchive(session)}
            >
                Archive
            </button>
        ) : null;

        return (
            <div className="card-bordered card card-compact mb-4 bg-purple-100 shadow-md">
                <div className="card-body">
                    <span>{name}</span>

                    {/* Show relative day session was created (e.g. "today"; "2 days ago") */}
                    {tabCreated}

                    <TabDetailList tabs={session.tabs} onRestore={onRestore} />
                    <div className="card-actions mt-2">
                        {restore}
                        {archive}
                    </div>
                </div>
            </div>
        );
    }
);
