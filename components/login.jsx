import React, { Component } from "react";
import http from "../services/httpService";
import auth from "../services/authService";
import jwtDecode from "jwt-decode";

class Login extends Component {
  state = {
    form: { email: "", password: "" },
    errors: {},
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
    this.handleValidate(e);
    this.setState(s1);
  };

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
    let { email, password } = this.state.form;
    let errors = {};
    errors.email = this.validateUsername(email);
    errors.password = this.validatePassword(password);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.email) {
      case "email":
        errors.email = this.validateUsername(input.value);
        break;
      case "password":
        errors.password = this.validatePassword(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  validateUsername = (email) => (!email ? "Email is required" : "");
  validatePassword = (password) => (!password ? "Password is required" : "");
  async login(url, obj) {
    try {
      let headerKey = "x-auth-token";
      let response = await http.post(url, obj);
      let { data, headers } = response;
      let token = headers[headerKey];
      console.log("response", response);
      console.log("post response: ", data);
      console.log("post response headers: ", headers);
      auth.storeToken(token);
      let user = jwtDecode(token);
      user.role === "Admin"
        ? (window.location = "/admin")
        : user.role === "Faculty"
        ? (window.location = "/faculty")
        : (window.location = "/student");
    } catch (ex) {
      console.log(ex.response);
      let errMsg = "Login Failed!!. Check the username and password";
      this.setState({ invalid: errMsg });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.login("/user", this.state.form);
  };

  render() {
    let { form, errors, invalid = null } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-5 text-center py-5">
            <h4 className="pb-4">Welcome to Training Institute App</h4>
            {invalid ? <span className="text-danger">{invalid}</span> : ""}
            <form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                <span className="form-text text-muted">
                  We'all never share your email with anyone else.
                </span>
                {errors.name ? (
                  <React.Fragment>
                    {" "}
                    <br />
                    <span className="text-danger">{errors.name}</span>
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
              <button
                type="submit"
                class="btn btn-primary btn-sm"
                disabled={!this.isFormValid()}
                onClick={this.handleSubmit}
              >
                Login
              </button>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}
export default Login;
