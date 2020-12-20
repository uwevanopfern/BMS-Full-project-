import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { buildingDetail, BEARERTOKEN } from "../store";
import axios from "axios";
import SearchBuilding from "./SearchBuilding";
import Contact from "./Contact";

class BuildingDetails extends React.Component {
  state = {
    building: {},
  };

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    axios
      .get(buildingDetail(params.buildingID), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          building: res.data,
        });
        // console.log (res.data);
      });
  }
  render() {
    return (
      <div className="scrollspy">
        <SearchBuilding />
        <section id="popular" className="section section-popular scrollspy">
          <div className="container">
            <div className="row">
              <nav>
                <div className="nav-wrapper teal">
                  <div className="col s12">
                    <Link to="/">
                      <a href="#!" className="breadcrumb">
                        <i className="material-icons">home</i>
                        Home
                      </a>
                    </Link>
                    <a href="#!" className="breadcrumb">
                      Building Details
                    </a>
                  </div>
                </div>
              </nav>
              <div className="col s12 m4">
                <div className="card">
                  <div className="card-image avatar">
                    <img src={this.state.building.avatar} alt="" />
                    <span className="card-title">
                      {this.state.building.name}
                    </span>
                  </div>
                  <div className="card-content">
                    <ul className="collection with-header">
                      <li className="collection-item">
                        {this.state.building.acronym}
                      </li>
                      <li className="collection-item">
                        {!!this.state.building.contact ? (
                          this.state.building.contact
                        ) : (
                          <div className="no-content">
                            <p>Contact not available</p>
                          </div>
                        )}
                      </li>
                      <li className="collection-item">
                        {!!this.state.building.email ? (
                          this.state.building.email
                        ) : (
                          <div className="no-content">
                            <p>Email not available</p>
                          </div>
                        )}
                      </li>
                      <li className="collection-item">
                        {!!this.state.building.website ? (
                          this.state.building.website
                        ) : (
                          <div className="no-content">
                            <p>Website not available</p>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col s12 m8">
                {typeof this.state.building.floors != "undefined" &&
                this.state.building.floors.length > 0 ? (
                  this.state.building.floors.map(function (floor) {
                    return (
                      <ul className="collapsible" key={floor.id}>
                        <li>
                          <div className="collapsible-header">
                            <i className="material-icons">business</i>
                            <h6>{floor.name}</h6>
                            <span
                              className="new badge grey darken-3"
                              data-badge-caption="Total blocks"
                            >
                              <strong>{floor.total_blocks}</strong>
                            </span>
                            <span
                              className="new badge grey darken-3"
                              data-badge-caption="All rooms"
                            >
                              <strong>{floor.total_rooms}</strong>
                            </span>
                          </div>
                          <ul className="collection with-header">
                            <li className="collection-header">
                              Available rooms
                            </li>

                            {floor.available_rooms.map(function (room) {
                              return (
                                <li className="collection-item avatar">
                                  <i className="material-icons circle teal">
                                    room
                                  </i>
                                  <span className="title">
                                    <div class="chip">
                                      Room name :{room.name}
                                    </div>
                                  </span>
                                  <p>
                                    <div class="chip">
                                      Room number :{room.number}
                                    </div>
                                    <br />
                                    <div class="chip">
                                      Room price :{" "}
                                      {`${room.price.toLocaleString()} RWF`}
                                    </div>
                                  </p>
                                  <Link
                                    className="secondary-content btn btn-small teal darken-3"
                                    style={{ marginTop: 33 }}
                                    to={{
                                      pathname: "/add-booking",
                                      data: room.id, // your data array of objects
                                    }}
                                  >
                                    <i className="material-icons left">book</i>
                                    Book{" "}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      </ul>
                    );
                  })
                ) : (
                  <div className="no-content center">
                    <p />
                    <a
                      href="#contact"
                      className="btn btn-large red darken-4"
                      style={{ marginTop: 100 }}
                    >
                      <i
                        className="material-icons left"
                        style={{ fontSize: 60 }}
                      >
                        not_listed_location
                      </i>
                      No further information available on this building
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col s12 center">
                <a href="#contact" className="btn btn-large grey darken-3">
                  <i className="material-icons left">send</i> Contact For
                  Booking
                </a>
              </div>
            </div>
          </div>
        </section>
        <Contact />
      </div>
    );
  }
}

export default BuildingDetails;
