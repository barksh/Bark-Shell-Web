/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Index
 */

export enum PAYLOAD_TYPE {

    MESSAGE = "message",
    UNAUTHORIZED = "unauthorized",
}

export enum ATTACHMENT_TYPE {

    TEXT = "TEXT",
    IMAGE = "IMAGE",
    LINK = "LINK",
}

export type BarkShellSuggestion = {

    readonly label: string;
    readonly value: string;
    readonly primary?: boolean;
    readonly description?: string;
};

export type BarkShellAttachment = {

    readonly type: ATTACHMENT_TYPE.TEXT;
    readonly message: string;
} | {
    readonly type: ATTACHMENT_TYPE.IMAGE;
    readonly src: string;
    readonly originalName: string;
    readonly size: string;
} | {
    readonly type: ATTACHMENT_TYPE.LINK;
    readonly alias: string;
    readonly url: string;
};

export type BarkShellResponse = {

    readonly message: string;
    readonly attachments?: BarkShellAttachment[];
    readonly suggestions?: BarkShellSuggestion[];
};

export type MessageHandler = (response: BarkShellResponse) => void;
export type AttemptingHandler = (attempt: number) => void;
export type UnauthorizedHandler = () => void;
export type FailingHandler = () => void;
