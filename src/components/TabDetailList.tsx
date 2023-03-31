import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { ITab } from "../types/ITab";
import { TabDetailComponent } from "./TabDetailComponent";

interface TabDetailListProps {
    tabs: ITab[];
    onRestore?: (tabs: ITab[]) => void;
}

export function TabDetailList__DEP({ tabs, onRestore }: TabDetailListProps) {
    if (!tabs) {
        return null;
    }
    // `restore` can be JSX or null
    const restore: JSX.Element | null = onRestore ? (
        <button
            className="btn-primary btn-sm btn"
            onClick={() => onRestore(tabs)}
        >
            Restore
        </button>
    ) : null;
    return (
        <>
            {/* <div className="card-bordered card card-compact mb-4 bg-purple-100 shadow-md">
            <div className="card-body"> */}
            {tabs.map((tab, index) => {
                return (
                    <div key={index}>
                        <TabDetailComponent tab={tab} />
                        {/* <TabDetailListItem tab={tab} /> */}
                    </div>
                );
            })}

            {/* <div className="card-actions mt-2">{restore}</div>
            </div>
        </div> */}
        </>
    );
}

export function TabDetailList__DEP2({ tabs, onRestore }: TabDetailListProps) {
    if (!tabs) {
        return null;
    }

    return (
        <div className="m-2 rounded-lg">
            <ul className="mb-8 space-y-2 text-left dark:text-gray-400">
                {tabs.map((tab, index) => {
                    return <TabDetailComponent tab={tab} key={index} />;
                })}
            </ul>
        </div>
    );
}

export function TabDetailList({ tabs, onRestore }: TabDetailListProps) {
    if (!tabs) {
        return null;
    }

    return (
        <Box>
            <List dense={true}>
                {tabs.map((tab, index) => {
                    return (
                        <ListItem
                            disableGutters={true}
                            dense={true}
                            disablePadding={true}
                        >
                            {/* Avatar is the favicon for the tab */}
                            <ListItemAvatar>
                                {/* sx={{
                                    width: 20, height: 20,
                                    // right-align the avatar
                                    marginLeft: "auto",
                                }} */}
                                <Avatar
                                    src={tab.favIconUrl}
                                    variant="rounded"
                                />
                            </ListItemAvatar>
                            <ListItemText primary={tab.title} />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
