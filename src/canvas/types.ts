export interface CanvasPoint {
	x: number
	y: number
}

export type CanvasThickness = 1 | 5 | 10 | 15

export interface CanvasDrawing {
	points: CanvasPoint[]
	thickness: CanvasThickness
	color: string
}

export interface DrawToServer {
	roomId: string
	drawing: CanvasDrawing
}
