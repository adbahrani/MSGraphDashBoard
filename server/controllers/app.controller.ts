import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common'
import axios from 'axios'
import { Response } from 'express'
import { LoginDto, SignupDto } from '../dto/auth.dto'
import { azureConfig } from '../config/azure'
import { AppService } from '../services/app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get('token')
    async sendToken(@Res({ passthrough: true }) response: Response) {
        const body = {
            client_id: process.env.Client_Id,
            client_secret: process.env.Client_Secret,
            scope: 'https://graph.microsoft.com/.default',
            grant_type: 'client_credentials',
        }
        const formData = Object.entries(body)
            .reduce((acc, [key, value]) => {
                acc.push(`${key}=${encodeURIComponent(value)}`)
                return acc
            }, [])
            .join('&')

        const { data } = await axios.post(
            `https://login.microsoftonline.com/${azureConfig.AzureTenantId}/oauth2/v2.0/token`,
            formData,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

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
    async loginUser(@Body() body: LoginDto) {
        const { email, password } = body
        const userData = await this.appService.login(email, password)
        if (userData) {
            return 'authenticated'
        }
        throw new HttpException('Invalid Credentials!', HttpStatus.FORBIDDEN)
    }

    @Post('signup')
    async signUp(@Body() body: SignupDto) {
        const { email, password, firstName, lastName } = body
        const userData = await this.appService.signup(email, password, firstName, lastName)
        if (userData) {
            return 'authenticated'
        }
        throw new HttpException('Something went wrong while signing up, please try again', HttpStatus.FORBIDDEN)
    }
}
