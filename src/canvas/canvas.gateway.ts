import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import {DrawToServer} from './types'

@WebSocketGateway({namespace: '/canvas', cors: true})
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	handleConnection(client: Socket, room: string) {
		client.on('room', (room) => {
			client.join(room)
		})
	}

	handleDisconnect(client: Socket) {}

	@SubscribeMessage('drawToServer')
	handleDraw(client: Socket, {roomId, drawing}: DrawToServer) {
		client.broadcast.to(roomId).emit('drawToClient', drawing)
	}

	@SubscribeMessage('undoToServer')
	handleUndo(client: Socket, room: string) {
		client.broadcast.to(room).emit('undoToClient')
	}

	@SubscribeMessage('redoToServer')
	handleRedo(client: Socket, room: string) {
		client.broadcast.to(room).emit('redoToClient')
	}

	@SubscribeMessage('resetToServer')
	handleReset(client: Socket, room: string) {
		client.broadcast.to(room).emit('resetToClient')
	}
}
