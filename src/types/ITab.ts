export interface ITab {
    id: number;
    title: string;
    pinned: boolean;
    // Group name and color are optional
    groupName?: string;
    groupColor?: string;
    url: string;
    favIconUrl?: string;
}

export { };
