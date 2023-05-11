const bodyParser = require("body-parser");
const cors = require("cors");
const app = require("express")();
//const mysql = require("mysql");
const port = 3333;

require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')
//connection.end()

// const connection = mysql.createConnection({
//   host: "localhost",
//   port: "3306",
//   user: "root",
//   password: "",
//   database: "mydb",
// });

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
const executer = (sql, args) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.get("/status", (req, res) => res.json({ status: "ok" }));

app.get("/jobs", async (req, res) => {
  const jobs = await executer("select * from jobs");
  return res.json({ status: "ok", results: jobs });
});
app.get("/jobs/:id", async (req, res) => {
  const jobs = await executer("select * from jobs where id = ?", [
    req.params.id,
  ]);
  return res.json({ status: "ok", result: jobs[0] });
});
app.post("/jobs", async (req, res) => {
  const result = await executer(
    "insert into jobs(name,description,email) values(?,?,?)",
    [req.body.name, req.body.description, req.body.email]
  );
  return res.json({
    message: "created successful",
    result,
  });
});
app.put("/jobs", async (req, res) => {
  const result = await executer(
    "update jobs set name=?,description=?,email=? where id=?",
    [req.body.name, req.body.description, req.body.email, req.body.id]
  );
  return res.json({
    message: "update successful",
    result,
  });
});
app.delete("/jobs/:id", async (req, res) => {
  await executer("delete from jobs where id = ?", req.params.id);
  return res.json({
    message: "remove successful",
  });
});
app.listen(port, () => console.log(`server is running on localhost:${port}`));
