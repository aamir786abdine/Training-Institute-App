import React, { Component } from "react";
import http from "../services/httpService";

class FacultyCourses extends Component {
  state = {
    courses: [],
  };

  async fetchData() {
    let prm = this.props.match.params;
    let newId = +prm.id;
    let response = await http.get(`/facultyCourse/${newId}`);
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

  ViewLectures = (id) => {
    window.location = `/myLecture/${id}`;
  };

  render() {
    let { courses } = this.state;
    console.log(courses);
    return (
      <div className="container py-3">
        <h4>All Courses</h4>
        <div className="row border-top h6 py-2 fw-bold text-center">
          <div className="col-2">Id</div>
          <div className="col-3">Course Title</div>
          <div className="col-3"></div>
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
            <div className="col-3">
              <button
                className="btn btn-success"
                onClick={() => this.ViewLectures(ele.id)}
              >
                View Lectures
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
export default FacultyCourses;
