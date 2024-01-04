import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from '../controllers/app.controller'
import { AppService } from '../services/app.service'
import { TokenMiddleware } from '../middleware/token.middleware'
import { MsGraphBaseService } from '../services/msgraph-base.service'

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, MsGraphBaseService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TokenMiddleware).forRoutes('*')
    }
}
