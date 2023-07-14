import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // 1) see if email is in use 
        const users = await this.usersService.find(email)
        if(users.length) throw new BadRequestException('This email in use, try another')

        // 2) hash the users password 
            // generate a salt
        const salt = randomBytes(8).toString('hex'); 
            
            // hash the password and salt together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

            // joined the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // 3) create new user and save it 
        const user = await this.usersService.create(email, result);

        // 4) return the user
        return user;
    }

    signin() {}
}
