import React, { Component } from "react";
import http from "../services/httpService";

class ViewStudentAllCourses extends Component {
  state = {
    courses: [],
  };

  async fetchData() {
    let prm = this.props.match.params;
    let newId = +prm.id;
    let response = await http.get(`/allCoursesStudent/${newId}`);
    let { data } = response;
    console.log(response);
    this.setState({ courses: data });
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.fetchData();
  }

  async postData(url, obj, title) {
    let response = await http.post(url, obj);
    alert("Successfully enroll at course " + title);
    window.location = "/student";
  }

  handleEnroll = (id, title, students) => {
    let prm = this.props.match.params;
    let stId = prm.id;
    let str2 = "";
    if (students) {
      let dollerIndex = students.indexOf("$");
      if (dollerIndex >= 0) {
        str2 = students + `$${stId}`;
      } else str2 = students + `$${stId}`;
    } else {
      str2 = `${stId}`;
    }
    console.log(str2);
    let newSt = { students: str2 };
    this.postData(`/enroll/${id}`, newSt, title);
  };

  render() {
    let { courses } = this.state;
    console.log(courses);
    return (
      <div className="container py-3">
        <h4>All Courses</h4>
        <div className="row border-top h6 py-2 fw-bold text-center">
          <div className="col-2">Id</div>
          <div className="col-3">Tile</div>
          <div className="col-3">Faculty</div>
        </div>
        {courses.map((ele, index) => (
          <div
            className={
              index % 2 === 0
                ? "row border-top border-bottom h6 py-3 bg-light text-center"
                : "row h6 py-2 text-center"
            }
            key={index}
          >
            <div className="col-2">{ele.id}</div>
            <div className="col-3">{ele.title}</div>
            <div className="col-3">{ele.name}</div>
            <div className="col-3">
              {!ele.myCourse ? (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    this.handleEnroll(ele.id, ele.title, ele.students)
                  }
                >
                  Enroll Now
                </button>
              ) : (
                <label className="text-success">Already enrolled</label>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
export default ViewStudentAllCourses;
