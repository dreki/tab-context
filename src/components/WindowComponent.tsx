// import { IWindow } from "../stores";
import { observer } from "mobx-react";
import { useState } from "react";
import { TabCollection } from "../stores/closedTabs";
import { Window } from "../stores/window";
import { TabDetailList } from "./TabDetailList";
import { TabList } from "./TabList";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Grid } from "@mui/material";

interface WindowComponentProps {
    window: Window;
    closedTabs: TabCollection;

    /**
     * A callback for when the user wants to save the window's current state to a session.
     * @param window  The window to suspend.
     * @returns  A promise that resolves when the window has been suspended.
     */
    onSuspend: (window: Window) => void;
}

/**
 * WindowComponent component. Renders a `Window`.
 * @param {WindowComponentProps} props
 */
export const WindowComponent = observer(function WindowComponent(
    props: WindowComponentProps
) {
    const [expand, setExpand] = useState<Boolean>(false);
    /*
    let closedTabs =
        props.closedTabs?.tabs?.map((tab) => {
            return <li key={tab.id}>{tab.title}</li>;
        }) || null;
    */

    // Show "X Closed Tabs" if there are closed tabs, even if there are 0.
    let closedTabs = <>...</>;
    if (props.closedTabs) {
        closedTabs = (
            <span className="text-base font-medium">
                {props.closedTabs.tabs.length} Closed Tabs
            </span>
        );
    }
    return (
        <div className="card-bordered card card-compact mb-8 bg-slate-50 shadow-md">
            {/* Hidden h2, for accessibility, noting window */}
            <h2 className="sr-only">Window {props.window.index}</h2>
            <div className="overflow-hidden rounded-t-2xl bg-slate-200 p-2">
                {/* Hidden h3 to note tab list */}
                <h3 className="sr-only">Tab List</h3>
                {/* If expanded, use TabDetailList */}
                {/* If not expanded, use TabList */}
                {expand? <TabDetailList tabs={props.window.tabs} /> : <TabList tabs={props.window.tabs} />}
                {/* <TabList tabs={props.window.tabs} /> */}
                <div className="grid place-items-center">
                    {/* When clicking button, flip `expand` */}
                    <button className="btn-ghost btn-xs btn" onClick={() => setExpand(!expand)}>
                        Click to expand
                    </button>
                </div>
            </div>
            <div className="card-body">
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2}>
                        {props.window.tabs.length} Tabs
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={2}>{closedTabs}</Grid>
                </Grid>
                <div className="card-actions mt-2">
                    <button
                        className="btn-primary btn-sm btn"
                        onClick={() => props.onSuspend(props.window)}
                    >
                        Suspend
                    </button>
                </div>
            </div>
        </div>
    );
});
