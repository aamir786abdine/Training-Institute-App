import React, { Component } from "react";
import queryString from "query-string";
import http from "../services/httpService";
import LeftPanelOptions from "./leftPanelStudent";

class ViewStudentAllLectures extends Component {
  state = {
    lectures: [],
    courses: [],
  };

  async fetchData() {
    let prm = this.props.match.params;
    let newId = +prm.id;
    let response = await http.get(`/allCourseLectures/${newId}`);
    let { data } = response;
    console.log(response);
    this.setState({ lectures: data.lectures, courses: data.course });
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

  handleOptionsChange = (options) => {
    let { course, id } = this.props.match.params;
    let newId = +id;
    this.callURl(`/student/allLectures/${newId}`, options);
  };

  callURl = (url, options) => {
    let searchString = this.makeSearchString(options);
    this.props.history.push({
      pathname: url,
      search: searchString,
    });
  };

  makeSearchString = (options) => {
    let { course } = options;
    let searchStr = "";
    searchStr = this.addToQueryString(searchStr, "course", course);
    return searchStr;
  };

  addToQueryString = (str, paramName, paramValue) =>
    paramValue
      ? str
        ? `${str}&${paramName}=${paramValue}`
        : `${paramName}=${paramValue}`
      : str;

  render() {
    let { lectures, courses } = this.state;
    let queryParams = queryString.parse(this.props.location.search);
    let { course } = queryParams;
    course = course ? course : "";
    let str = course.split(",");
    console.log(str, lectures);
    str = str.map((item) => courses.find((val) => val.course == item));
    if (str[0]) {
      let temp = [];
      for (let val of str) {
        let data1 = lectures.filter((item) => item.courseid == val.id);
        temp = temp.concat(data1);
      }
      lectures = [...temp];
    } else lectures = [];
    return (
      <div className="row">
        <div className="col-3 py-4">
          <LeftPanelOptions
            courses={courses}
            options={queryParams}
            handleOptionChange={this.handleOptionsChange}
          />
        </div>
        <div className="col-9">
          <div className="container py-3">
            <h4>All Lectures</h4>
            <div className="row border-top h6 py-2 fw-bold text-center">
              <div className="col-2">Course Id</div>
              <div className="col-4">Topic</div>
              <div className="col-3">Date & Time</div>
            </div>
            {lectures.map((ele, index) => (
              <div
                className={
                  index % 2 === 0
                    ? "row border-top border-bottom h6 py-3 bg-light text-center"
                    : "row h6 py-2 text-center"
                }
                key={index}
              >
                <div className="col-2">{ele.courseid}</div>
                <div className="col-4">{ele.topic}</div>
                <div className="col-3">{ele.date}</div>
                <div className="col-3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default ViewStudentAllLectures;
