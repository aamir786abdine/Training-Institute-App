import React, { Component } from "react";
import http from "../services/httpService";

class Attendance extends Component {
  state = {
    students: [],
    presentSt: [],
    arr: [],
  };
  handleChange = (e) => {
    let { currentTarget: input } = e;
    let { arr } = this.state;
    let index = arr.findIndex((ele) => ele == input.value);
    if (index >= 0) arr.splice(index, 1);
    else arr.push(input.value);
    this.setState({ arr });
  };
  async fetchData() {
    let prm = this.props.match.params;
    let courseId = +prm.courseid;
    let lecid = +prm.lecid;
    let response = await http.get(`/attendanceStudent/${courseId}/${lecid}`);
    let { data } = response;
    console.log(response);
    let s1 = { ...this.state };
    let filArr = data.courseStudent.map((ele) => {
      if (ele.isPresent) s1.arr.push(ele.id);
    });
    s1.students = data.courseStudent;
    s1.presentSt = data.lecStudent;
    this.setState(s1);
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.fetchData();
  }

  async postData(url, obj) {
    let response = await http.post(url, obj);
    alert("Attendance updated successfully");
    window.location = "/faculty";
  }

  saveAttendance = () => {
    let prm = this.props.match.params;
    let lecid = +prm.lecid;
    let { arr } = this.state;
    if (arr.length > 0) {
      if (arr.length === 1) {
        let str = arr[0];
        this.postData(`/markAttendance/${lecid}`, { data: str });
      } else if (arr.length === 2) {
        let str = arr[0] + "$" + arr[1];
        this.postData(`/markAttendance/${lecid}`, { data: str });
      } else {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
          if (i === arr.length - 1) str += arr[i];
          else str += arr[i] + "$";
        }
        this.postData(`/markAttendance/${lecid}`, { data: str });
      }
    } else window.location = "/faculty";
  };

  render() {
    let { students, arr } = this.state;
    console.log(arr);
    return (
      <div className="container pt-4">
        {students.length > 0 ? (
          <main>
            <h4 className="pb-2">All Students in that Lecture</h4>
            <ul>
              {students.map((st, index) => (
                <div
                  className={
                    index % 2 === 0
                      ? "row border-top border-bottom h6 py-3 bg-light text-center"
                      : "row h6 py-2 text-center"
                  }
                  key={index}
                >
                  <div className="col-2">{index + 1}</div>
                  <div className="col-3">{st.name}</div>
                  <div className="col-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="student"
                        id="student"
                        value={st.id}
                        checked={
                          arr.findIndex((ele) => ele == st.id) >= 0
                            ? true
                            : false
                        }
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </ul>
            <div className="row text-center">
              <div className="col-4"></div>
              <div className="col-4">
                <button
                  className="btn btn-primary"
                  onClick={() => this.saveAttendance()}
                >
                  Save
                </button>
              </div>
              <div className="col-4"></div>
            </div>
          </main>
        ) : (
          <div className="text-center pt-3">
            <h3 className="text-info">No students in that lecture.</h3>
          </div>
        )}
      </div>
    );
  }
}
export default Attendance;
