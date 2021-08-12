import React, { Component } from "react";
import http from "../services/httpService";

class ViewAllCourses extends Component {
  state = {
    courses: [],
  };

  async fetchData() {
    let response = await http.get("/allCourses");
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
          </div>
        ))}
      </div>
    );
  }
}
export default ViewAllCourses;
