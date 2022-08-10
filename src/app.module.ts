import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {CanvasModule} from './canvas/canvas.module'

@Module({
	imports: [CanvasModule],
	controllers: [AppController],
})
export class AppModule {}
