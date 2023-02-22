/**
 * Enum for the different types of messages that can be passed from the service worker to the UI.
 */
export enum MessageType {
    AddMostRecentClosedTab = "addMostRecentClosedTab",
}

/**
 * Interface for messages passed from the service worker to the UI.
 */
export interface IMessage {
    type: MessageType;
    targetWindowId: number;
}

/**
 * Interface for responses passed from the UI to the service worker.
 */
export interface IResponse {
    success: boolean;
}

export { };
