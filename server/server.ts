import path from 'path'

import { default as axios } from 'axios'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT ?? 5000

const app = express()

app.use(compression())
app.use(express.json())
app.use(cors({ origin: '*' }))

app.use(express.static('client/build'))

app.get('/token', async (_, res) => {
    const body = {
        client_id: process.env.Client_Id,
        client_secret: process.env.Client_Secret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
    }

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })

    const formData = Object.entries(body)
        .reduce((acc, [key, value]) => {
            acc.push(`${key}=${encodeURIComponent(value)}`)
            return acc
        }, [])
        .join('&')

    const { data } = await axios.post(
        'https://login.microsoftonline.com/a6dfed0e-808d-4a2e-ae4f-9adac874f50d/oauth2/v2.0/token',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    res.cookie('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .status(200)
        .send(data.access_token)
})

app.get('/report', async (req, res) => {
    const { token, reportType, period } = req.query

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

    res.header('Content-Type', 'text/csv')
    res.attachment(`${reportType}-${period}-days-${new Date().toISOString()}.csv`)
    res.send(data)
})

app.listen(PORT, function () {
    console.log(`server started on port http://localhost:${PORT}`)
    console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env)
})
