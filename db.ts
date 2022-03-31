import postgres from "postgres";

const { PSQL_HOST, PSQL_PORT, PSQL_DB, PSQL_USER, PSQL_PASS } = process.env;

const sql = postgres({
  host: PSQL_HOST,
  port: parseInt(PSQL_PORT as string, 10),
  database: PSQL_DB,
  username: PSQL_USER,
  password: PSQL_PASS,
});

export default sql;
