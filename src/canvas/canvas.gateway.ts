import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import {CanvasService} from './canvas.service'
import {DrawToServer} from './types'

@WebSocketGateway({namespace: '/canvas', cors: true})
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	constructor(private canvasService: CanvasService) {}

	handleConnection(client: Socket) {
		client.on('joinRoom', (room) => {
			client.join(room)
		})
	}

	handleDisconnect(client: Socket) {}

	@SubscribeMessage('drawToServer')
	handleDraw(client: Socket, {roomId, drawing}: DrawToServer) {
		this.canvasService.addUndoAction(roomId, drawing)
		client.broadcast.to(roomId).emit('drawToClient', drawing)
	}

	@SubscribeMessage('undoToServer')
	handleUndo(client: Socket, room: string) {
		this.canvasService.undo(room)
		client.broadcast.to(room).emit('undoToClient')
	}

	@SubscribeMessage('redoToServer')
	handleRedo(client: Socket, room: string) {
		this.canvasService.redo(room)
		client.broadcast.to(room).emit('redoToClient')
	}

	@SubscribeMessage('resetToServer')
	handleReset(client: Socket, room: string) {
		this.canvasService.addUndoAction(room, 'reset')
		client.broadcast.to(room).emit('resetToClient')
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(client: Socket, room: string) {
		this.canvasService.deleteRoom(room)
	}

	@SubscribeMessage('loadActionsToServer')
	handleLoadActions(client: Socket, room: string) {
		client.emit('loadActionsToClient', this.canvasService.getActions(room))
	}
}
