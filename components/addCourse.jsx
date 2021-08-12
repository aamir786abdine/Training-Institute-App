import React, { Component } from "react";
import http from "../services/httpService";

class AddCourse extends Component {
  state = {
    form: { title: "", faculty: "" },
    errors: {},
    faculties: [],
  };
  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
    this.handleValidate(e);
    this.setState(s1);
  };

  async componentDidMount() {
    let response = await http.get("/allFaculties");
    let { data } = response;
    console.log(data);
    this.setState({ faculties: data });
  }

  isFormValid = () => {
    let errors = this.validateAll();
    return this.isValid(errors);
  };

  isValid = (errors) => {
    let keys = Object.keys(errors);
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  validateAll = () => {
    let { title, faculty } = this.state.form;
    let errors = {};
    errors.title = this.validateTitle(title);
    errors.faculty = this.validateFac(faculty);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "title":
        errors.title = this.validateTitle(input.value);
        break;
      case "faculty":
        errors.faculty = this.validateFac(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  validateTitle = (title) => (!title ? "Title is required" : "");

  validateFac = (fac) => (!fac ? "Select any one Faculty" : "");

  async postData(url, obj) {
    let response = await http.post(url, obj);
    alert("Course added successfully");
    window.location = "/allCourses";
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.postData("/addCourse", this.state.form);
  };

  render() {
    let { form, errors, faculties } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="py-3">
            <h4 className="pb-1">Add New Course</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Title here"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.title ? (
                  <React.Fragment>
                    {" "}
                    <span className="text-danger">{errors.title}</span>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Faculty</label>
                <select
                  className="form-select"
                  id="faculty"
                  name="faculty"
                  value={form.faculty}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                >
                  <option selected value="">
                    Select Faculty
                  </option>
                  {faculties.map((ele) => (
                    <option value={ele} key={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
                {errors.faculty ? (
                  <span className="text-danger">{errors.faculty}</span>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                class="btn btn-primary btn-sm"
                disabled={!this.isFormValid()}
                onClick={this.handleSubmit}
              >
                Add Course
              </button>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}
export default AddCourse;
