import { ITab } from "../types/ITab";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailListItemProps {
    tab: ITab;
}

/**
 * Returns the favicon for an ITab, or a default favicon if the tab has no favicon.
 */
// function tabIconWithDefault(tab: ITab): string {
//     let url = tab.favIconUrl;

// }

export function TabDetailListItem(props: TabDetailListItemProps) {
    // let avatar = (
    //     <Avatar sx={{ height: 20, width: 20}}><LanguageIcon /></Avatar>
    // )
    // if (props.tab.favIconUrl) {
    //     avatar = (
    //         <Avatar src={props.tab.favIconUrl} />
    //     );
    // }
    // return (
    //     <ListItem>
    //         <ListItemAvatar>
    //             {/* <Avatar src=""></Avatar> */}
    //             {avatar}
    //         </ListItemAvatar>
    //         <ListItemText primary={props.tab.title} />
    //     </ListItem>
    // );
    return (
        <>
            <FavIconWithDefault tab={props.tab} className={"align-middle"} />
            <span className="text-base">{props.tab.title}</span>
        </>
    );
}
