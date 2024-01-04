import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import * as utils from 'util'

const promisifiedFsReadFile = utils.promisify(fs.readFile)
const promisifiedFsWriteFile = utils.promisify(fs.writeFile)

const userJsonFile = path.resolve(__dirname, './../users.json')

@Injectable()
export class AppService {
    async login(email: string, password: string) {
        const users: Array<{ email: string; password: string }> = JSON.parse(
            await promisifiedFsReadFile(userJsonFile, 'utf-8')
        )
        return users.find(user => {
            return user.email === email && user.password === password
        })
    }

    async signup(email: string, password: string, firstName: string, lastName: string) {
        const newUser = {
            email,
            password,
            firstName,
            lastName,
        }
        const users: Array<{ email: string; password: string }> = JSON.parse(
            await promisifiedFsReadFile(userJsonFile, 'utf-8')
        )
        const existingUserIndex = users.findIndex(user => {
            return user.email === email
        })
        if (existingUserIndex === -1) {
            users.push(newUser)
        } else {
            users[existingUserIndex] = newUser
        }
        await promisifiedFsWriteFile(userJsonFile, JSON.stringify(users), 'utf8')
        return newUser
    }
}
