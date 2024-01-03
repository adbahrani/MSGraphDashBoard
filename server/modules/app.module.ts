import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from '../controllers/app.controller'
import { AppService } from '../services/app.service'
import { TokenMiddleware } from '../middleware/token.middleware'

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TokenMiddleware).forRoutes('*')
    }
}
