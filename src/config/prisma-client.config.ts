// import { PrismaMssql } from "@prisma/adapter-mssql";
// import { PrismaClient } from "../../generated/prisma/client";

// const config = {
// host:"aws-1-eu-central-1.pooler.supabase.com",

// port:6543,

// database:"postgres",

// user:"postgres.amiudwhyquxopitpfdbn",


//   // options: {
//   //   encrypt: true, 
//   //   trustServerCertificate: true 
//   // }
// };

// const adapter = new PrismaMssql(config);
// const prisma = new PrismaClient({ adapter });

// export default prisma;

import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client";

dotenv.config();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export default prisma;