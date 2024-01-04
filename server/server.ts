import express from 'express'
import cors from 'cors'
import path from 'path'
import compression from 'compression'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'

const PORT = process.env.PORT ?? 5000

dotenv.config()
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser())
    app.use(compression())
    app.use(express.json())
    app.use(cors({ origin: '*' }))
    app.use(express.static('client/build'))
    await app.listen(PORT, function () {
        console.log(`server started on port http://localhost:${PORT}`)
        console.log('Express server listening on port %d', PORT)
    })
}
bootstrap()
