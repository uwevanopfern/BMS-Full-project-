import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { addBooking, BEARERTOKEN } from "../store";
import axios from "axios";
import SearchBuilding from "./SearchBuilding";
import Contact from "./Contact";

class AddBooking extends React.Component {
  state = {
    roomID: "",
    errorMessage: "",
    successAction: "",
  };

  componentDidMount() {
    const { data } = this.props.location;
    this.setState({
      roomID: data,
    });
  }

  handleAddBookingRoom = (event) => {
    event.preventDefault();
    const client_name = event.target.elements.client_name.value;
    const client_email = event.target.elements.client_email.value;
    const client_phone = event.target.elements.client_phone.value;
    const client_address = event.target.elements.client_address.value;
    const business_desc = event.target.elements.business_desc.value;

    axios
      .post(
        addBooking,
        {
          room: this.state.roomID,
          client_name: client_name,
          client_email: client_email,
          client_phone: client_phone,
          client_address: client_address,
          business_desc: business_desc,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      // res.status
      .then((res) => {
        this.setState({ successAction: res.status });
        console.log(this.state.roomID);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data.response });
        console.log(this.state.errorMessage);
      });

    setTimeout("location.reload(true);", 2000);
  };

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
                      Book a room
                    </a>
                  </div>
                </div>
              </nav>
              <div className="col s12 m10 offset-m1">
                <h5>Add your profile and your business description</h5>
                <hr />
                <div className="card-panel grey lighten-5">
                  {this.state.successAction === 201 ? (
                    <a href="#contact" className="btn btn-large green darken-4">
                      <i className="material-icons left">done_all</i> Your
                      booking has been sent successfully!!
                    </a>
                  ) : (
                    ""
                  )}
                  <h6>Please fill out this of booking</h6>
                  <form onSubmit={(event) => this.handleAddBookingRoom(event)}>
                    <div className="input-field">
                      <i className="material-icons prefix">account_circle</i>
                      <input
                        type="text"
                        name="client_name"
                        placeholder="Client Name"
                        id="name"
                      />
                      <p>
                        {this.state.errorMessage
                          ? this.state.errorMessage.client_name
                          : ""}
                      </p>
                    </div>
                    <div className="input-field">
                      <i className="material-icons prefix">email</i>
                      <input
                        type="email"
                        name="client_email"
                        placeholder="Client Email"
                        id="email"
                      />
                      <p>
                        {this.state.errorMessage
                          ? this.state.errorMessage.client_email
                          : ""}
                      </p>
                    </div>
                    <div className="input-field">
                      <i className="material-icons prefix">phone</i>
                      <input
                        type="text"
                        name="client_phone"
                        placeholder="Client Phone"
                        id="phone"
                      />
                      <p>
                        {this.state.errorMessage
                          ? this.state.errorMessage.client_phone
                          : ""}
                      </p>
                    </div>
                    <div className="input-field">
                      <i className="material-icons prefix">add_location</i>
                      <input
                        type="text"
                        name="client_address"
                        placeholder="Client Address"
                        id="phone"
                      />
                      <p>
                        {this.state.errorMessage
                          ? this.state.errorMessage.client_address
                          : ""}
                      </p>
                    </div>
                    <div className="input-field">
                      <i className="material-icons">business</i>
                      <textarea
                        name="business_desc"
                        className="materialize-textarea"
                        placeholder="Business description"
                        id="business_desc"
                      />
                      <p>
                        {this.state.errorMessage
                          ? this.state.errorMessage.business_desc
                          : ""}
                      </p>
                    </div>
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                    >
                      Add booking
                      <i className="material-icons right">book</i>
                    </button>
                  </form>
                </div>
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

export default AddBooking;
