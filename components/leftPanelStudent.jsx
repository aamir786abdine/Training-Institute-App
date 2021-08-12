import React, { Component } from "react";

class LeftPanelOptions extends Component {
  handleChange = (e) => {
    let { currentTarget: input } = e;
    let options = { ...this.props.options };
    options[input.name] = this.updateCBs(
      options[input.name],
      input.checked,
      input.value
    );
    console.log(options);
    this.props.handleOptionChange(options);
  };

  updateCBs = (inpvalues, checked, value) => {
    let inpArr = inpvalues ? inpvalues.split(",") : [];
    if (checked) inpArr.push(value);
    else {
      let index = inpArr.findIndex((ele) => ele === value);
      if (index >= 0) inpArr.splice(index, 1);
    }
    return inpArr.join(",");
  };

  render() {
    let { courses } = this.props;
    let { course = "" } = this.props.options;
    let courseArr = course.split(",");
    console.log("courseArr", courseArr);
    console.log("LeftPanel", courses);
    return (
      <React.Fragment>
        <div className="row" style={{ paddingLeft: "2rem" }}>
          <div className="col-12  py-2 border-top border-end border-start bg-light fw-bold">
            Courses
          </div>
          {courses.map((ele, index) => (
            <div
              className={
                index % 2 === 0
                  ? "col-12 border py-2"
                  : index === courses.length - 1
                  ? "col-12 py-2 border-start border-end border-bottom"
                  : "col-12 py-2 border-start border-end"
              }
              key={index}
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="course"
                  id="course"
                  value={ele.course}
                  checked={
                    courseArr.findIndex((val) => val === ele.course) >= 0
                  }
                  onChange={this.handleChange}
                />
                <label class="form-check-label">{ele.course}</label>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
export default LeftPanelOptions;
