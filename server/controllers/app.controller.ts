import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common'
import axios from 'axios'
import path from 'path'
import { Response } from 'express'
import { LoginDto, SignupDto } from '../dto/auth.dto'
import { AppService } from '../services/app.service'
import { fetchToken } from '../utils/token'

const buildIndexFile = path.join(__dirname, '../../client/build/index.html')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get('token')
    async sendToken(@Res({ passthrough: true }) response: Response) {
        const data = await fetchToken()

        response.cookie('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })

        return data.access_token
    }

    @Get('report')
    async sendReport(@Query() query: { token: string; reportType: string; period: string }, @Res() response: Response) {
        const { token, reportType, period } = query

        const { data } = await axios.get(
            `https://graph.microsoft.com/v1.0/reports/microsoft.graph.${reportType}(period='D${period}')`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ConsistencyLevel: 'eventual',
                },
                responseType: 'blob',
            }
        )

        response.header('Content-Type', 'text/csv')
        response.attachment(`${reportType}-${period}-days-${new Date().toISOString()}.csv`)
        response.send(data)
    }

    @Post('login')
    @HttpCode(200)
    async loginUser(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
        const { email, password } = body
        const userData = await this.appService.login(email, password)
        if (userData) {
            const tokenData = await this.sendToken(response)
            return {
                token: tokenData,
            }
        }
        throw new HttpException('Invalid Credentials!', HttpStatus.FORBIDDEN)
    }

    @Post('signup')
    async signUp(@Body() body: SignupDto, @Res({ passthrough: true }) response: Response) {
        const { email, password, firstName, lastName } = body
        const userData = await this.appService.signup(email, password, firstName, lastName)
        if (userData) {
            const tokenData = await this.sendToken(response)
            return {
                token: tokenData,
            }
        }
        throw new HttpException('Something went wrong while signing up, please try again', HttpStatus.FORBIDDEN)
    }

    @Delete('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('access_token')
    }

    @Get('*')
    async catchAllRoute(@Res() response: Response) {
        response.sendFile(buildIndexFile)
    }
}
