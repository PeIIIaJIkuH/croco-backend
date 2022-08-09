import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import {CanvasDrawing} from './types'

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
	handleDraw(client: Socket, drawing: CanvasDrawing) {
		client.broadcast.emit('drawToClient', drawing)
	}

	@SubscribeMessage('undoToServer')
	handleUndo(client: Socket) {
		client.broadcast.emit('undoToClient')
	}

	@SubscribeMessage('redoToServer')
	handleRedo(client: Socket) {
		client.broadcast.emit('redoToClient')
	}

	@SubscribeMessage('resetToServer')
	handleReset(client: Socket) {
		client.broadcast.emit('resetToClient')
	}
}
