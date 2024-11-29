import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Nakamura0601",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  console.log(result.rows);
  res.render("index.ejs", { countries: JSON.stringify(result.rows), total: result.rows.length, hi: "<script>alert('Hi')</script>"});
  // await db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
