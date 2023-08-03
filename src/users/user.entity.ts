import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany  } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from '../reports/report.entity';

console.log(Report);

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

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