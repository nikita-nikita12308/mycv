import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: process.env.NODE_ENV === 'production' ?  ['**/*.entity.js'] : ['**/*.entity.ts'],
    migrations: [__dirname + '/migrations/*{.js,.ts}'],
} as DataSourceOptions)