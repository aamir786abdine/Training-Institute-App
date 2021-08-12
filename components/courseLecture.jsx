import React, { Component } from "react";
import http from "../services/httpService";

class FacultyLectures extends Component {
  state = {
    lectures: [],
  };

  async fetchData() {
    let prm = this.props.match.params;
    let newId = +prm.id;
    let response = await http.get(`/courseLecture/${newId}`);
    let { data } = response;
    console.log(response);
    this.setState({ lectures: data });
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.fetchData();
  }

  handleMarkAttendance = (courseid, lecId) => {
    window.location = `/attendance/lecture/${courseid}/${lecId}`;
  };

  render() {
    let { lectures } = this.state;
    console.log(lectures);
    return (
      <div className="container py-3">
        {lectures.length > 0 ? (
          <main>
            <h4>All Lectures</h4>
            <div className="row border-top h6 py-2 fw-bold text-center">
              <div className="col-2">Id</div>
              <div className="col-2">Course ID</div>
              <div className="col-3">Topic</div>
              <div className="col-3">Date & Time</div>
              <div className="col-2"></div>
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
                <div className="col-2">{ele.id}</div>
                <div className="col-2">{ele.courseid}</div>
                <div className="col-3">{ele.topic}</div>
                <div className="col-3">{ele.date}</div>
                <div className="col-2">
                  <button
                    className="btn btn-info text-light"
                    onClick={() =>
                      this.handleMarkAttendance(ele.courseid, ele.id)
                    }
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            ))}
          </main>
        ) : (
          <div className="text-center">
            <h4 className="text-info">Currently There are no lectures</h4>
          </div>
        )}
      </div>
    );
  }
}
export default FacultyLectures;
