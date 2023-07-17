import { Test } from '@nestjs/testing';
import { AuthService } from  './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // create a fake copy of users service\
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user  = { 
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password    
                } as User
                users.push(user);
                return Promise.resolve(user);   
            }
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
    
        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('create a new user with a salted and hashed password', async () => {
        const user = await service.signup('tyomich@gmail.com', '12341');

        expect(user.password).not.toEqual('12341'); 
        const [ salt, hash ] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User]);
        await expect(service.signup('as@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
      });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(
            NotFoundException
        );
    });

    it('throws if invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User]);
        await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException
        );
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('antonio@gmail.com', 'antonio921');

        const user = await service.signin('antonio@gmail.com', 'antonio921')
        expect(user).toBeDefined();
    })
    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('antonio@gmail.com', 'asd');
        await expect(service.signup('antonio@gmail.com', 'asd')).rejects.toThrow(
            BadRequestException
        )
    })
    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
      });
     
    it('throws if an invalid password is provided', async () => {
        await service.signup('laskdjf@alskdfj.com', 'password');
        await expect(
          service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
    });

})

