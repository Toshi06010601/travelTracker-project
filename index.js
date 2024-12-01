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

const checkVisited = async () => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  const countries = result.rows;

  const country_codes = [];
  countries.forEach(country => {
    country_codes.push(country.country_code);
  });

  return country_codes;

};

const addVisitedCountry = async (country_code) => {
  try {
    await db.query("INSERT INTO visited_countries (country_code) VALUES($1)", [country_code]);
    return "";
  } catch (err) {
    console.log(err.message);
    return "Country has been already added, try again.";
  }
}

app.get("/", async (req, res) => {
  const country_codes = await checkVisited();
  res.render("index.ejs", { countries: country_codes, total: country_codes.length });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  let error_message = "";

  try {
    //Look up coutry code
    const result = await db.query("SELECT country_code FROM countries where country_name = $1", [input]);

    //Try to add a new country to visited countries table
    const country_code = result.rows[0].country_code;
    error_message = await addVisitedCountry(country_code);

  } catch(err) {

    console.log("There is no matching country for " + input)
    error_message = "Country doesn't exist, try again.";

  }

  //Get updated visited countries list
  const country_codes = await checkVisited();
  res.render("index.ejs", { countries: country_codes, total: country_codes.length, error: error_message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
