import React, { Component } from "react";
import http from "../services/httpService";

class AddPerson extends Component {
  state = {
    form: { name: "", email: "", password: "", role: "" },
    errors: {},
    users: [],
  };
  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
    this.handleValidate(e);
    this.setState(s1);
  };

  async componentDidMount() {
    let response = await http.get("/allUsers");
    let { data } = response;
    this.setState({ users: data });
  }

  isFormValid = () => {
    console.log("inside of=sFormValid");
    let errors = this.validateAll();
    console.log(this.isValid(errors));
    return this.isValid(errors);
  };

  isValid = (errors) => {
    let keys = Object.keys(errors);
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  validateAll = () => {
    let { name, email, password, role } = this.state.form;
    let errors = {};
    errors.name = this.validateUsername(name);
    errors.email = this.validateEmail(email);
    errors.password = this.validatePassword(password);
    errors.role = this.validateRole(role);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "name":
        errors.name = this.validateUsername(input.value);
        break;
      case "email":
        errors.email = this.validateEmail(input.value);
        break;
      case "password":
        errors.password = this.validatePassword(input.value);
        break;
      case "role":
        errors.role = this.validateRole(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  validateUsername = (name) => (!name ? "Person name is required" : "");

  validateEmail = (email) => {
    let { users } = this.state;
    if (!email) return "Email Id is required";
    let findExist = users.find((ele) => ele.email === email);
    if (findExist) return "Email already Exist is database";
    else return "";
  };

  validatePassword = (password) =>
    !password
      ? "password can not be blank. Minimum length should be 7 characters."
      : password.length < 7
      ? "password can not be blank. Minimum length should be 7 characters."
      : "";

  validateRole = (role) => (!role ? "Select any one option" : "");

  async postData(url, obj) {
    console.log("Inside postdat");
    let response = await http.post(url, obj);
    alert("Person added successfully");
    window.location = "/allPersons";
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.postData("/addPerson", this.state.form);
  };

  render() {
    let { form, errors } = this.state;
    let roles = ["Admin", "Faculty", "Student"];
    return (
      <div className="container">
        <div className="row">
          <div className="py-3">
            <h4 className="pb-1">Add New Person</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Person name"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.name ? (
                  <React.Fragment>
                    {" "}
                    <span className="text-danger">{errors.name}</span>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.email ? (
                  <React.Fragment>
                    {" "}
                    <span className="text-danger">{errors.email}</span>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.password ? (
                  <span className="text-danger">{errors.password}</span>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                >
                  <option selected value="">
                    Select Role
                  </option>
                  {roles.map((ele) => (
                    <option value={ele} key={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
                {errors.role ? (
                  <span className="text-danger">{errors.role}</span>
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
                Submit
              </button>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}
export default AddPerson;
