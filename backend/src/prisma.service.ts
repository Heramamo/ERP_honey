import { Injectable } from "@nestjs/common";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: 'mysql-heramamo.alwaysdata.net',
  port: 3306,
  user: 'ton_user',
  password: 'ton_password',
  database: 'heramamo_erp',
});

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ adapter });
  }
}