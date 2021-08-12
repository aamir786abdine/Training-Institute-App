import React, { Component } from "react";

class NotAllowed extends Component {
  render() {
    return (
      <div className="container py-5">
        <h2 className="text-center text-danger display-4 fw-bold">
          <i>
            This functionality is <s>Not Allowed</s>
          </i>
        </h2>
      </div>
    );
  }
}
export default NotAllowed;
