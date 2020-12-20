import React from "react";
import "../App.css";
import { bookingDetail, pendingBookings, BEARERTOKEN } from "../store";
import axios from "axios";

class Booking extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    errorMessage: "",
    successAction: "",
    allPendingBookings: [],
  };
  componentDidMount() {
    const userObject = localStorage.getItem("user_object")
      ? localStorage.getItem("user_object")
      : "";

    let convertedUserObject = JSON.parse(userObject);
    this.setState({
      id: convertedUserObject.id,
      email: convertedUserObject.email,
      name: convertedUserObject.name,
      buildingId: convertedUserObject.buildingId,
      building_name: convertedUserObject.building_name,
      building_acronym: convertedUserObject.building_acronym,
      is_manager: convertedUserObject.is_manager,
      is_employee: convertedUserObject.is_employee,
    });
    // console.log (convertedUserObject);

    //Get all latest pending bookings
    axios
      .get(pendingBookings(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        // console.log (res.data.response);
        this.setState({
          allPendingBookings: res.data.response,
        });
      });
  }

  handleConfirmBooking = (event) => {
    const bookingId = event.target.elements.bookingId.value;

    axios
      .patch(
        bookingDetail(bookingId),
        {
          is_confirmed: true,
        }
        // {
        //   headers: {Authorization: BEARERTOKEN},
        // }
      )
      .then((res) => {
        // M.toast({ html: "Booking has been confirmed successully" });
        this.setState({ successAction: res.status });
      })
      .catch((err) => {
        // M.toast({ html: err });
        this.setState({ errorMessage: err.response.data });
        console.log(err);
      });
  };

  handleDeleteBooking = (event) => {
    const bookingId = event.target.elements.bookingId.value;

    axios
      .delete(bookingDetail(bookingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        // M.toast({ html: "Booking has been deleted successully" });
        console.log(res);
      })
      .catch((err) => {
        // M.toast({ html: err });
        console.log(err);
      });
  };

  render() {
    return (
      <div className="site-card-wrapper">
        <div className="row">
          <div className="row">
            <div className="col s12 m12">
              <div className="card">
                <div className="card-content">
                  <span className="card-title">Latest booking</span>
                  <table className="striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Business description</th>
                        <th>Action</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {typeof this.state.allPendingBookings != "undefined" &&
                      this.state.allPendingBookings.length > 0 ? (
                        this.state.allPendingBookings.map(function (booking) {
                          return (
                            <tr key={booking.id}>
                              <td>{booking.client_name}</td>
                              <td>{booking.client_email}</td>
                              <td>{booking.client_phone}</td>
                              <td>{booking.client_address}</td>
                              <td>{booking.business_desc}</td>
                              <td>
                                <form
                                  onSubmit={(event) =>
                                    this.handleConfirmBooking(event)
                                  }
                                >
                                  <input
                                    type="hidden"
                                    name="bookingId"
                                    value={booking.id}
                                  />
                                  <button
                                    type="submit"
                                    className="btn green-text white-text"
                                  >
                                    <i className="material-icons">thumb_up</i>
                                  </button>
                                </form>
                                <br />
                                <form
                                  onSubmit={(event) =>
                                    this.handleDeleteBooking(event)
                                  }
                                >
                                  <input
                                    type="hidden"
                                    name="bookingId"
                                    value={booking.id}
                                  />
                                  <button
                                    type="submit"
                                    className="btn red-text"
                                  >
                                    <i className="material-icons">thumb_down</i>
                                  </button>
                                </form>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <div className="no-content center">
                          <p />
                          <a
                            href="#contact"
                            className="btn btn-big red darken-4"
                          >
                            <i
                              className="material-icons left"
                              style={{ fontSize: 30 }}
                            >
                              info
                            </i>
                            There is no latest or new booking available at this
                            time in your business building
                          </a>
                        </div>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Booking;
