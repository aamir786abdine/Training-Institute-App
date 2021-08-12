import React, { Component } from "react";
import auth from "../services/authService";
import jwtDecode from "jwt-decode";

class Home extends Component {
  render() {
    let token = auth.getToken();
    let user = jwtDecode(token);
    return (
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6 text-center py-4">
            <h4 className="text-danger">
              {user.role === "Admin"
                ? "Welcome to Training Institute App"
                : user.role === "Faculty"
                ? "Welcome to Training Institute App Faculty Portal"
                : "Welcome to Training Institute App Student Portal"}
            </h4>
            <img
              src="https://hotelleriejobs.s3.amazonaws.com/news/18011/image_url/Capture_d_e_cran_2017-04-13_a__12.21.31.png"
              alt="Image not found"
              style={{ width: "70%" }}
            />
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    );
  }
}
export default Home;
