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
  const countries = result.rows;
  const country_codes = [];

  countries.forEach(country => {
    country_codes.push(country.country_code);
  });

  console.log(country_codes);

  res.render("index.ejs", { countries: country_codes, total: result.rows.length});
  await db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
