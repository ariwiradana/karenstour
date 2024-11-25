import { Pool } from "pg";

const sql = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
export default sql;
