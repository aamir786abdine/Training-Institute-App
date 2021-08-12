import React, { Component } from "react";
import http from "../services/httpService";

class ViewAllPersons extends Component {
  state = {
    persons: [],
  };

  async fetchData() {
    let response = await http.get("/allUsers");
    let { data } = response;
    this.setState({ persons: data });
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.fetchData();
  }

  render() {
    let { persons } = this.state;
    return (
      <div className="container py-3">
        <h4>All Persons</h4>
        <div className="row border-top h6 py-2 fw-bold text-center">
          <div className="col-2">Id</div>
          <div className="col-3">Name</div>
          <div className="col-3">Email</div>
          <div className="col-3">Role</div>
        </div>
        {persons.map((ele, index) => (
          <div
            className={
              index % 2 === 0
                ? "row border-top border-bottom h6 py-3 bg-light text-center"
                : "row h6 py-2 text-center"
            }
            key={index}
          >
            <div className="col-2">{ele.id}</div>
            <div className="col-3">{ele.name}</div>
            <div className="col-3">{ele.email}</div>
            <div className="col-3">{ele.role}</div>
          </div>
        ))}
      </div>
    );
  }
}
export default ViewAllPersons;
