import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { jwtDecode } from 'jwt-decode'
import { fetchToken } from '../utils/token'

interface RequestWithToken extends Request {
    token?: string
}
@Injectable()
export class TokenMiddleware implements NestMiddleware {
    async use(req: RequestWithToken, res: Response, next: NextFunction) {
        const accessToken = req.cookies['access_token']
        req.token = accessToken
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken)
                const expDate = new Date(0)
                expDate.setUTCSeconds(decodedToken.exp)
                const isExpired = expDate <= new Date()
                if (isExpired) {
                    const data = await fetchToken()

                    res.cookie('access_token', data.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                    })
                    req.token = data.access_token
                }
            } catch (err) {
                console.log('err while reading token is', err)
            }
        }

        next()
    }
}
