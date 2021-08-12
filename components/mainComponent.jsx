import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";
import auth from "../services/authService";
import NavBar from "./navBar";
import Login from "./login";
import Logout from "./logout";
import Home from "./home";
import ViewAllPersons from "./allPersons";
import ViewAllCourses from "./allCourses";
import AddPerson from "./addPerson";
import AddCourse from "./addCourse";
import FacultyCourses from "./viewFacCourses";
import FacultyLectures from "./courseLecture";
import Attendance from "./attendance";
import ViewStudentAllCourses from "./studentAllCourses";
import ViewStudentAllLectures from "./studentAllLectures";
import NotAllowed from "./notAllowed";

class MainComponent extends Component {
  render() {
    let token = auth.getToken();
    let user = token ? jwtDecode(token) : null;
    console.log(user);
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route
            path="/student/allCourses/:id"
            render={(props) =>
              user ? (
                user.role === "Student" ? (
                  <ViewStudentAllCourses {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/student/allLectures/:id"
            render={(props) =>
              user ? (
                user.role === "Student" ? (
                  <ViewStudentAllLectures {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/facultyCourse/:id"
            render={(props) =>
              user ? (
                user.role === "Faculty" ? (
                  <FacultyCourses {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/myLecture/:id"
            render={(props) =>
              user ? (
                user.role === "Faculty" ? (
                  <FacultyLectures {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/attendance/lecture/:courseid/:lecid"
            render={(props) =>
              user ? (
                user.role === "Faculty" ? (
                  <Attendance {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route path="/notAllowed" component={NotAllowed} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route
            path="/admin"
            render={(props) =>
              user ? (
                user.role === "Admin" ? (
                  <Home {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/faculty"
            render={(props) =>
              user ? (
                user.role === "Faculty" ? (
                  <Home {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/student"
            render={(props) =>
              user ? (
                user.role === "Student" ? (
                  <Home {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allPersons"
            render={(props) =>
              user ? (
                user.role === "Admin" ? (
                  <ViewAllPersons {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allCourses"
            render={(props) =>
              user ? (
                user.role === "Admin" ? (
                  <ViewAllCourses {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/addPerson"
            render={(props) =>
              user ? (
                user.role === "Admin" ? (
                  <AddPerson {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/addCourse"
            render={(props) =>
              user ? (
                user.role === "Admin" ? (
                  <AddCourse {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </React.Fragment>
    );
  }
}
export default MainComponent;
