const fs = require("fs");
const fastcsv = require("fast-csv");
const Pool = require("pg").Pool;

function insertDb(csvFile) {
  let stream = fs.createReadStream(csvFile);
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // remove the first line: header
      csvData.shift();

      // connect to the PostgreSQL database
      // save csvData
    });
  stream.pipe(csvStream);
  return csvData;
}

const pool = new Pool({
  host: "your host",
  user: "your use name",
  database: "your dbname",
  password: "Your Password",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

function insertPersons() {
  let csvData = insertDb("persons.csv");
  const query =
    "INSERT INTO persons (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)";

  pool.connect((err, client, done) => {
    if (err) throw err;
    try {
      csvData.forEach((row) => {
        client.query(query, row, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", row);
          }
        });
      });
    } finally {
      done();
    }
  });
}

function insertCourses() {
  let csvData = insertDb("courses.csv");
  const query =
    "INSERT INTO courses (id,title,facultyId,students) VALUES ($1, $2, $3, $4)";

  pool.connect((err, client, done) => {
    if (err) throw err;
    try {
      csvData.forEach((row) => {
        client.query(query, row, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", row);
          }
        });
      });
    } finally {
      done();
    }
  });
}
function insertLectures() {
  let csvData = insertDb("lectures.csv");
  const query =
    "INSERT INTO lectures (id,courseId,topic,date,attendance) VALUES ($1, $2, $3, $4,$5)";

  pool.connect((err, client, done) => {
    if (err) throw err;
    try {
      csvData.forEach((row) => {
        client.query(query, row, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", row);
          }
        });
      });
    } finally {
      done();
    }
  });
}

//insertCourses();
//insertLectures();
//insertPersons();
