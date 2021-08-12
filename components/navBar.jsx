import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import http from "../services/httpService";
import jwtDecode from "jwt-decode";

class NavBar extends Component {
  state = {
    courses: [],
  };

  async fetchData() {
    let token = auth.getToken();
    let user = token ? jwtDecode(token) : null;
    if (user) {
      let newId = +user.id;
      let response = await http.get(`/allCourseLectures/${newId}`);
      let { data } = response;
      console.log(response);
      this.setState({ courses: data.course });
    }
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.fetchData();
  }

  render() {
    let token = auth.getToken();
    let user = token ? jwtDecode(token) : null;
    let { courses } = this.state;
    let arr = courses.map((ele) => ele.course);
    let str = arr.join(",");
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              {user
                ? user.role === "Admin"
                  ? "Admin"
                  : user.role === "Faculty"
                  ? "Faculty"
                  : user.role === "Student"
                  ? "Student"
                  : "Training Institute App"
                : "Training Institute App"}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {!user && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login">
                      Login
                    </Link>
                  </li>
                )}
                {user && user.role === "Admin" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Persons
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/addPerson">
                          Add Person
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/allPersons">
                          View All Persons
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "Admin" && (
                  <li class="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Courses
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item blue" to="/addCourse">
                          Add Course
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/allCourses">
                          View all Courses
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "Faculty" && (
                  <li className="nav-item">
                    <Link className="nav-link" to={`/facultyCourse/${user.id}`}>
                      View Courses
                    </Link>
                  </li>
                )}
                {user && user.role === "Student" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/student/allCourses/${user.id}`}
                    >
                      View All Courses
                    </Link>
                  </li>
                )}
                {user && user.role === "Student" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/student/allLectures/${user.id}?course=${str}`}
                    >
                      View All Lectures
                    </Link>
                  </li>
                )}
              </ul>
              <span
                className="nav-item text-light"
                style={{ marginRight: "0.8rem" }}
              >
                {user ? "Welcome " + user.name : ""}
              </span>
              {user && (
                <span className="navbar-link">
                  <Link to="/logout" className="nav-link text-light">
                    Logout
                  </Link>
                </span>
              )}
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
export default NavBar;
