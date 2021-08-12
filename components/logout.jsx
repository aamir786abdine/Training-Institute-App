import React, { Component } from "react";
import auth from "../services/authService";

class Logout extends Component {
  componentDidMount() {
    auth.removeToken();
    window.location = "/login";
  }
  render() {
    return <div className="container"></div>;
  }
}
export default Logout;
