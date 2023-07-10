import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('insert user with id: ' + this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('update user with id: ' + this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('remove user with id: ' + this.id);
    }
}