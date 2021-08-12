const express = require("express");
let passport = require("passport");
let jwt = require("jsonwebtoken");
let JWTStrategy = require("passport-jwt").Strategy;
let ExtractJWT = require("passport-jwt").ExtractJwt;
const Pool = require("pg").Pool;

var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Expose-Headers", "X-Auth-Token");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Mehtods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.use(passport.initialize());

var port = process.env.PORT || 2410;
app.listen(port, () => console.log("Node App Listening on port", port));

// create a new connection pool to the database
const pool = new Pool({
  host: "your host",
  user: "your use name",
  database: "your dbname",
  password: "Your Password",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

var users = [];

function findUsers() {
  const query = "SELECT *FROM persons";
  pool.connect((err, client, done) => {
    if (err) throw err;
    try {
      client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          users = res.rows;
        }
      });
    } finally {
      done();
    }
  });
}

findUsers();

let params = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "jwsSecretKey46466",
};

// I don't want to take an expiryTime.
//const jwtExpirySeconds = 600;

let strategyAdmin = new JWTStrategy(params, function (token, done) {
  console.log("In JWTStrategy-Admin", token);
  let user = users.find((u1) => u1.id === token.id);
  if (!user)
    return done(null, false, { message: "Incorrect username and password" });
  else if (user.role !== "Admin")
    return done(null, false, { message: "You don't have admin role." });
  else return done(null, user);
});

let strategyFaculty = new JWTStrategy(params, function (token, done) {
  console.log("In JWTStrategy-Faculty", token);
  let user = users.find((u1) => u1.id === token.id);
  if (!user)
    return done(null, false, { message: "Incorrect username and password" });
  else if (user.role !== "Faculty")
    return done(null, false, { message: "You don't have faculty role." });
  else return done(null, user);
});

let strategyStudent = new JWTStrategy(params, function (token, done) {
  console.log("In JWTStrategy-Student", token);
  let user = users.find((u1) => u1.id === token.id);
  if (!user)
    return done(null, false, { message: "Incorrect username and password" });
  else if (user.role !== "Student")
    return done(null, false, { message: "You don't have Studentt role." });
  else return done(null, user);
});

passport.use("roleAdmin", strategyAdmin);
passport.use("roleFaculty", strategyFaculty);
passport.use("roleStudent", strategyStudent);

//All Methods for Admin

app.post("/user", function (req, res) {
  let { email, password } = req.body;
  let user1 = users.find(
    (ele) => ele.email === email && ele.password === password
  );
  if (user1) {
    let payload = { id: user1.id, name: user1.name, role: user1.role };
    let token = jwt.sign(payload, params.secretOrKey, {
      algorithm: "HS256",
    });
    res.setHeader("x-auth-token", token);
    //res.setHeader("Authorization", token);
    res.send(payload);
    //res.send({ token: "bearer " + token });
  } else res.sendStatus(401);
});

app.post(
  "/addPerson",
  passport.authenticate("roleAdmin", { session: false }),
  function (req, res) {
    let body = req.body;
    let id = users.reduce((acc, curr) => (acc > curr.id ? acc : curr.id), 0);
    let data = [id + 1, body.name, body.email, body.password, body.role];
    const query =
      "INSERT INTO persons(id,name,email,password,role) VALUES($1,$2,$3,$4,$5)";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, data, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("affected " + res.rowCount + " row");
          }
        });
      } finally {
        done();
        res.send(data);
      }
    });
  }
);

app.post(
  "/addCourse",
  passport.authenticate("roleAdmin", { session: false }),
  function (req, res) {
    let body = req.body;
    let faculty = users.find((ele) => ele.name === body.faculty);
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        var data = null;
        const query = "SELECT id from courses";
        client.query(query, (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("row nside ", result.rows);
            let arr = result.rows;
            var maxId = arr.reduce(
              (acc, curr) => (acc > curr.id ? acc : curr.id),
              0
            );
            console.log("maxId", maxId);
            data = [maxId + 1, body.title, faculty.id];
            console.log(data);
            const query2 =
              "INSERT INTO courses(id,title,facultyid) VALUES($1,$2,$3)";
            console.log("data", data);
            client.query(query2, data, (err, result) => {
              if (err) {
                console.log(err.stack);
                res.status(400).send("Data not found");
              } else {
                console.log("affected " + result.rowCount + " row");
                res.send(data);
              }
            });
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/allCourses",
  passport.authenticate("roleAdmin", { session: false }),
  function (req, res) {
    const query =
      "SELECT courses.id,courses.title,persons.name FROM courses INNER JOIN persons ON courses.facultyid = persons.id";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("courses inside ", result.rows);
            res.send(result.rows);
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/allUsers",
  passport.authenticate("roleAdmin", { session: false }),
  function (req, res) {
    let data = users.map((ele) => {
      let data1 = {
        id: ele.id,
        name: ele.name,
        email: ele.email,
        role: ele.role,
      };
      return data1;
    });
    res.send(data);
  }
);

app.get(
  "/allFaculties",
  passport.authenticate("roleAdmin", { session: false }),
  function (req, res) {
    let faculties = users.filter((ele) => ele.role === "Faculty");
    console.log(faculties);
    let arr = faculties.map((ele) => ele.name);
    res.send(arr);
  }
);

// All methods for Faculties.
app.get(
  "/facultyCourse/:id",
  passport.authenticate("roleFaculty", { session: false }),
  (req, res) => {
    let id = req.params.id;
    const query = "SELECT *FROM courses WHERE facultyid=$1";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, [id], (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("faculty data ", result.rows);
            res.send(result.rows);
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/courseLecture/:id",
  passport.authenticate("roleFaculty", { session: false }),
  (req, res) => {
    let id = req.params.id;
    const query = "select *from lectures where courseid=$1";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, [id], (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("course data ", result.rows);
            res.send(result.rows);
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.post(
  "/addLecture/:id",
  passport.authenticate("roleFaculty", { session: false }),
  (req, res) => {
    let id = req.params.id;
    let body = req.body;
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        var data = null;
        const query = "SELECT id from lectures";
        client.query(query, (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("row inside ", result.rows);
            let arr = result.rows;
            var maxId = arr.reduce(
              (acc, curr) => (acc > curr.id ? acc : curr.id),
              0
            );
            console.log("maxId", maxId);
            data = [maxId + 1, id, body.topic, body.date];
            console.log(data);
            const query2 =
              "INSERT INTO lectures(id,courseid,topic,date) VALUES($1,$2,$3,$4)";
            console.log("data", data);
            client.query(query2, data, (err, result) => {
              if (err) {
                console.log(err.stack);
                res.status(400).send("Data not found");
              } else {
                console.log("affected " + result.rowCount + " row");
                res.send(data);
              }
            });
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/courseStudent/:id",
  passport.authenticate("roleFaculty", { session: false }),
  (req, res) => {
    let courseId = req.params.id;
    const query = "select *from courses where id=$1";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, [courseId], (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("faculty data ", result.rows);
            let arr1 = result.rows[0].students.split("$");
            let students = [];
            let students1 = users.map((ele) => {
              for (let i = 0; i < arr1.length; i++) {
                if (ele.id == arr1[i]) {
                  let data = { id: ele.id, name: ele.name };
                  students.push(data);
                }
              }
            });
            res.send(students);
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/attendanceStudent/:courseId/:lecId",
  passport.authenticate("roleFaculty", { session: false }),
  (req, res) => {
    let courseId = req.params.courseId;
    let lecId = req.params.lecId;
    const query = "select *from courses where id=$1";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        let studentsArr = [];
        let attendanceArr = [];
        client.query(query, [courseId], (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("students data ", result.rows);
            let arr1 = result.rows[0].students
              ? result.rows[0].students.split("$")
              : [];
            let students1 = users.map((ele) => {
              for (let i = 0; i < arr1.length; i++) {
                if (ele.id == arr1[i]) {
                  let data = { id: ele.id, name: ele.name };
                  studentsArr.push(data);
                }
              }
            });
            let sql2 = "select *from lectures where id=$1";
            client.query(sql2, [lecId], (err, result) => {
              if (err) {
                console.log(err.stack);
                res.status(400).send("Data not found");
              } else {
                console.log("students data ", result.rows);
                let arr1 = result.rows[0].attendance
                  ? result.rows[0].attendance.split("$")
                  : [];
                let students1 = users.map((ele) => {
                  for (let i = 0; i < arr1.length; i++) {
                    if (ele.id == arr1[i]) {
                      let data = { id: ele.id, name: ele.name };
                      attendanceArr.push(data);
                    }
                  }
                });
                for (let i = 0; i < studentsArr.length; i++) {
                  for (j = 0; j < attendanceArr.length; j++) {
                    if (studentsArr[i].id === attendanceArr[j].id)
                      studentsArr[i].isPresent = true;
                  }
                }
                let sendData = {
                  courseStudent: studentsArr,
                  lecStudent: attendanceArr,
                };
                console.log(sendData);
                res.send(sendData);
              }
            });
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.post(
  "/markAttendance/:id",
  passport.authenticate("roleFaculty", { session: false }),
  (req, res) => {
    let body = req.body.data;
    let lectureId = req.params.id;
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        let sql2 = "UPDATE lectures SET attendance=$1 WHERE id=$2";
        client.query(sql2, [body, lectureId], (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(500).send("Insternal server error");
          } else {
            console.log("number of rows affected", result.rowCount);
            res.send("Attendace marked successfully");
          }
        });
      } finally {
        done();
      }
    });
  }
);

// All methods for Students.
app.post(
  "/enroll/:id",
  passport.authenticate("roleStudent", { session: false }),
  (req, res) => {
    let id = req.params.id;
    let body = req.body.students;
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        let sql = "UPDATE courses SET students=$1 WHERE id=$2";

        client.query(sql, [body, id], (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("number of rows affected " + result.rowCount);
            res.send("Update student successfully");
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/allCoursesStudent/:id",
  passport.authenticate("roleStudent", { session: false }),
  function (req, res) {
    let id = req.params.id;
    const query =
      "SELECT courses.id,courses.title,persons.name,courses.students FROM courses INNER JOIN persons ON courses.facultyid = persons.id";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, (err, result) => {
          if (err) {
            console.log(err.stack);
            res.status(400).send("Data not found");
          } else {
            console.log("courses inside ", result.rows);
            let arr = result.rows.filter((ele) => {
              return ele.students;
            });
            let arr1 = result.rows.filter((ele) => {
              return !ele.students;
            });
            for (let i = 0; i < arr.length; i++) {
              let arr2 = arr[i].students.split("$");
              for (j = 0; j < arr2.length; j++) {
                if (arr2[j] == id) {
                  arr[i].myCourse = true;
                }
              }
            }
            finalArr = [...arr, ...arr1];
            console.log("finalArr", finalArr);
            res.send(finalArr);
          }
        });
      } finally {
        done();
      }
    });
  }
);

app.get(
  "/allCourseLectures/:id",
  passport.authenticate("roleStudent", { session: false }),
  (req, res) => {
    let id = req.params.id;
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        let sql = "select *from courses where students!=''";
        let idArr = [];
        let courseArr = [];
        client.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).send("Data not found");
          } else {
            console.log("Data are: ", result.rows);
            let arr = result.rows;
            for (let i = 0; i < arr.length; i++) {
              let arr2 = arr[i].students.split("$");
              for (j = 0; j < arr2.length; j++) {
                if (arr2[j] == id) {
                  arr[i].myCourse = true;
                }
              }
            }
            let arr2 = arr.map((ele) => {
              if (ele.myCourse) {
                let json = { id: ele.id, course: ele.title };
                idArr.push(ele.id);
                courseArr.push(json);
              }
            });
            console.log(idArr);
          }
          let sql2 = "select *from lectures where " + findCourseId(idArr);
          console.log("sql2", sql2);
          client.query(sql2, idArr, (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).send("Data not found");
            } else {
              let arr = result.rows;
              let data = { course: courseArr, lectures: result.rows };
              res.send(data);
            }
          });
        });
      } finally {
        done();
      }
    });
  }
);

function findCourseId(arr) {
  let str = "";
  if (arr.length > 1) {
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1) str += "courseid=$" + (i + 1);
      else str += "courseid=$" + (i + 1) + " or ";
    }
  } else str += "courseid=$1";
  console.log(str);
  return str;
}
