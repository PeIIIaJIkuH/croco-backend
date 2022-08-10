import {Injectable} from '@nestjs/common'
import {CanvasAction, Room} from './types'

@Injectable()
export class CanvasService {
	private readonly rooms: Record<string, Room> = {}

	createRoomIfNotExist(roomId: string) {
		if (!this.rooms[roomId]) {
			this.rooms[roomId] = {
				undoList: [],
				redoList: [],
			}
		}
	}

	addUndoAction(roomId: string, action: CanvasAction, clearRedoList = false) {
		this.createRoomIfNotExist(roomId)
		action && this.rooms[roomId].undoList.push(action)
		clearRedoList && (this.rooms[roomId].redoList = [])
	}

	addRedoAction(roomId: string, action: CanvasAction) {
		this.createRoomIfNotExist(roomId)
		action && this.rooms[roomId].redoList.push(action)
	}

	undo(roomId: string) {
		this.createRoomIfNotExist(roomId)
		if (this.rooms[roomId].undoList.length === 0) return
		const action = this.rooms[roomId].undoList.pop()
		this.addUndoAction(roomId, action, true)
	}

	redo(roomId: string) {
		this.createRoomIfNotExist(roomId)
		if (this.rooms[roomId].redoList.length === 0) return
		const action = this.rooms[roomId].redoList.pop()
		this.addRedoAction(roomId, action)
	}

	deleteRoom(roomId: string) {
		delete this.rooms[roomId]
	}

	getActions(roomId: string) {
		return this.rooms[roomId]
	}
}
