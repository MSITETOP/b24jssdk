import { LoggerBrowser, LoggerType } from '../logger/browser'
import Type from '../tools/type'
import {ConnectionType, type TypeConnector} from '../types/pull'
import type {
	ConnectorParent,
	ConnectorCallbacks,
	ConnectorConfig
} from '../types/pull'

export abstract class AbstractConnector
	implements TypeConnector
{
	private _logger: null|LoggerBrowser = null
	
	protected _connected: boolean = false
	
	protected _connectionType: ConnectionType
	
	protected _disconnectCode: number = 0
	protected _disconnectReason: string = ''
	
	protected _parent: ConnectorParent
	
	protected _callbacks: ConnectorCallbacks
	
	protected constructor(config: ConnectorConfig)
	{
		this._parent = config.parent
		this._connectionType = ConnectionType.Undefined
		
		this._callbacks = {
			onOpen: Type.isFunction(config.onOpen)
				? config.onOpen
				: () => {},
			onDisconnect: Type.isFunction(config.onDisconnect)
				? config.onDisconnect
				: () => {},
			onError: Type.isFunction(config.onError)
				? config.onError
				: () => {},
			onMessage: Type.isFunction(config.onMessage)
				? config.onMessage
				: () => {}
		} as ConnectorCallbacks
	}
	
	setLogger(logger: LoggerBrowser): void
	{
		this._logger = logger
	}
	
	getLogger(): LoggerBrowser
	{
		if(null === this._logger)
		{
			this._logger = LoggerBrowser.build(
				`NullLogger`
			)
			
			this._logger.setConfig({
				[LoggerType.desktop]: false,
				[LoggerType.log]: false,
				[LoggerType.info]: false,
				[LoggerType.warn]: false,
				[LoggerType.error]: true,
				[LoggerType.trace]: false,
			})
		}
		
		return this._logger
	}
	
	destroy(): void
	{
	
	}
	
	get connected()
	{
		return this._connected
	}
	
	set connected(value)
	{
		if(value == this._connected)
		{
			return
		}
		
		this._connected = value
		
		if(this._connected)
		{
			this._callbacks.onOpen()
		}
		else
		{
			this._callbacks.onDisconnect({
				code: this.disconnectCode,
				reason: this.disconnectReason
			})
		}
	}
	
	get disconnectCode(): number
	{
		return this._disconnectCode
	}
	
	get disconnectReason(): string
	{
		return this._disconnectReason
	}
	
	get connectionPath(): string
	{
		return this._parent.getConnectionPath(
			this._connectionType
		)
	}
	
	/**
	 * Make connect to the server
	 */
	abstract connect(): void
	
	/**
	 * Make disconnect from the server
	 * @param code
	 * @param reason
	 */
	abstract disconnect(
		code: number,
		reason: string
	): void
	
	/**
	 * Sends some data to the server
	 * @param {ArrayBuffer|string} buffer Data to send.
	 * @return {boolean}
	 */
	abstract send(buffer: ArrayBuffer|string): boolean
}