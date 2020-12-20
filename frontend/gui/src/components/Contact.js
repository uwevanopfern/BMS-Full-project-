import React from 'react';
import '../App.css';
import {contacts, BEARERTOKEN} from '../store';
import axios from 'axios';

class Contact extends React.Component {
  state = {
    errorMessage: '',
    successAction: '',
  };
  handleContactCreation = event => {
    event.preventDefault ();
    const name = event.target.elements.name.value;
    const email = event.target.elements.email.value;
    const phone = event.target.elements.phone.value;
    const message = event.target.elements.message.value;

    axios
      .post (
        contacts,
        {
          name: name,
          email: email,
          phone: phone,
          message: message,
        },
        {
          headers: {Authorization: BEARERTOKEN},
        }
      )
      // res.status
      .then (res => {
        this.setState ({successAction: res.status});
      })
      .catch (err => {
        this.setState ({errorMessage: err.response.data});
        console.log (this.state.errorMessage);
      });

    setTimeout ('location.reload(true);', 2000);
  };

  render () {
    return (
      <section id="contact" className="section section-contact scrollspy">
        <div className="container">
          <div className="row">
            <div className="col s12 m6">
              <div className="card-panel teal white-text center">
                <i className="material-icons medium">email</i>
                <h5>Contact Us For Booking</h5>
                <p>
                  BMS stands for Building Management System, through BMS you can see available rooms of all buildings and be able to book one,
                  If you are building owner or manager, BMS helps to manage and track each and every tenant's histories of your room including
                  {' '}
                  alert both building manager or owner and tenant next payment time, and ending rental time promptly.
                </p>
              </div>
              <ul className="collection with-header">
                <li className="collection-header">
                  <h5>Reach on us by call/whatsapp</h5>
                  <a href="#contact" className="btn btn-medium grey darken-3">
                    <i className="material-icons left">phone</i>
                    {' '}
                    Phone number: +(250) 782-816-597
                  </a>
                </li>
              </ul>
            </div>
            <div className="col s12 m6" style={{marginTop: -12}}>
              <h5>Tell us your issue or give us suggestion</h5><hr />
              <div className="card-panel grey lighten-3">
                {this.state.successAction === 201
                  ? <a href="#contact" className="btn btn-large green darken-4">
                      <i className="material-icons left">done_all</i>
                      {' '}
                      Thank you for contacting us!!
                    </a>
                  : ''}
                <h5>Please fill out this Form</h5>
                <form onSubmit={event => this.handleContactCreation (event)}>
                  <div className="input-field">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      id="name"
                    />
                    <p>
                      {this.state.errorMessage
                        ? this.state.errorMessage.name[0]
                        : ''}
                    </p>
                    <label htmlFor="name">Name</label>
                  </div>
                  <div className="input-field">
                    <input
                      type="email"
                      name="emai"
                      placeholder="Email"
                      id="email"
                    />
                    <p>
                      {this.state.errorMessage
                        ? this.state.errorMessage.email[0]
                        : ''}
                    </p>
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="input-field">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      id="phone"
                    />
                    <p>
                      {this.state.errorMessage
                        ? this.state.errorMessage.phone[0]
                        : ''}
                    </p>
                    <label htmlFor="phone">Phone</label>
                  </div>
                  <div className="input-field">
                    <textarea
                      name="message"
                      className="materialize-textarea"
                      placeholder="Enter Message"
                      id="message"
                    />
                    <p>
                      {this.state.errorMessage
                        ? this.state.errorMessage.message[0]
                        : ''}
                    </p>
                    <label htmlFor="message">Message</label>
                  </div>
                  <input type="submit" value="Submit" className="btn" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Contact;
