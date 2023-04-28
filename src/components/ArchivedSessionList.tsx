import { Collapse } from "antd";
import { observer } from "mobx-react";
import { Session } from "../stores/session";
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
                <Collapse ghost={true} className="relative -left-3.5 mb-10">
                    <Collapse.Panel
                        header={
                            <span className="text-base font-medium">
                                {sessions.length + " Sessions"}
                            </span>
                        }
                        key="1"
                    >
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
                    </Collapse.Panel>
                </Collapse>
            </>
        );
    }
);
