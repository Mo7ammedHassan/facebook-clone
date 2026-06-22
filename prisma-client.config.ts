import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "./generated/prisma/client";

const config = {
  server: "localhost",
  port: 1433,
  database: "mydb",
  integratedSecurity:true,
  options: {
    encrypt: true,
    trustServerCertificate: true, // For self-signed certificates
  },
};
const adapter = new PrismaMssql(config);
const prisma = new PrismaClient({ adapter });

export default prisma;