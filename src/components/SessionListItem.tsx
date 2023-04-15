import { observer } from "mobx-react";
import { Session } from "../stores/session";
import { ITab } from "../types/ITab";
import { TabDetailList } from "./TabDetailList";

interface SessionListItemProps {
    session: Session;
    onRestore: (tabs: ITab[]) => void;
}

export const SessionListItem = observer(
    ({ session, onRestore }: SessionListItemProps) => {
        const name = session.name ? session.name : "(Unnamed)";

        const restore: JSX.Element | null = onRestore ? (
            <button
                className="btn-primary btn-sm btn"
                onClick={() => onRestore(session.tabs)}
            >
                Restore
            </button>
        ) : null;
        return (
            <div className="card-bordered card card-compact mb-4 bg-purple-100 shadow-md">
                <div className="card-body">
                    <span>{name}</span>
                    <TabDetailList tabs={session.tabs} onRestore={onRestore} />
                    <div className="card-actions mt-2">{restore}</div>
                </div>
            </div>
        );
    }
);
