/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description Socket
 */

import SocketIO from "socket.io-client";
import { AttemptingHandler, FailingHandler, MessageHandler } from "./declare";

export class BarkSocket {

    public static create(webSocketPath: string): BarkSocket {

        return new BarkSocket(webSocketPath);
    }

    private readonly _webSocketPath: string;

    private _socket: SocketIOClient.Socket | null = null;

    private _messageHandler: MessageHandler | null = null;
    private _connectErrorHandler: FailingHandler | null = null;
    private _reconnectErrorHandler: FailingHandler | null = null;
    private _reconnectingHandler: AttemptingHandler | null = null;

    private _bearer: string | null = null;

    private constructor(webSocketPath: string) {

        this._webSocketPath = webSocketPath;
    }

    public get socketId(): string {
        return this._socket.id;
    }
    public get connected(): boolean {
        return this._socket.connected;
    }

    public declareMessageHandler(messageHandler: MessageHandler): this {
        this._messageHandler = messageHandler;
        return this;
    }
    public declareConnectErrorHandler(failingHandler: FailingHandler): this {
        this._connectErrorHandler = failingHandler;
        return this;
    }
    public declareReconnectingHandler(attemptingHandler: AttemptingHandler): this {
        this._reconnectingHandler = attemptingHandler;
        return this;
    }
    public declareReconnectErrorHandler(failingHandler: FailingHandler): this {
        this._reconnectErrorHandler = failingHandler;
        return this;
    }

    public useBearer(token: string): this {

        this._bearer = token;
        return this;
    }

    public establish(reconnectionAttempts: number = 10): this {

        const socket: SocketIOClient.Socket = SocketIO(this._webSocketPath, {
            autoConnect: true,
            forceNew: true,
            reconnection: true,
            reconnectionAttempts,
            transportOptions: {
                polling: {
                    extraHeaders: this._buildHeaders(),
                },
            },
        });
        if (this._messageHandler) {
            socket.on('message', this._messageHandler);
        }
        if (this._connectErrorHandler) {
            socket.on('connect_error', this._connectErrorHandler);
            socket.on('connect_timeout', this._connectErrorHandler);
        }
        if (this._reconnectingHandler) {
            socket.on('reconnect_attempt', this._reconnectingHandler);
        }
        if (this._reconnectErrorHandler) {
            socket.on('reconnect_error', this._reconnectErrorHandler);
            socket.on('reconnect_failed', this._reconnectErrorHandler);
        }

        this._socket = socket;
        return this;
    }

    public destroy(): this {

        this._socket.close();
        this._socket = null;
        return this;
    }

    public send(value: string): this {

        this._socket.emit('message', value);
        return this;
    }

    public emit(event: string, value: string): this {

        this._socket.emit(event, value);
        return this;
    }

    private _buildHeaders(): Record<string, string> {

        const headers: Record<string, string> = {};
        if (this._bearer) {
            headers.Authorization = `bearer ${this._bearer}`;
        }

        return headers;
    }
}
