import React from "react";
import "../App.css";
import SearchBuilding from "./SearchBuilding";
import LatestAddedBuilding from "./LatestAddedBuilding";
import Contact from "./Contact";
const $ = window.$;

class LandingPage extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <div className="scrollspy">
        <section className="slider">
          <ul className="slides">
            <li>
              <img src="https://i.picsum.photos/id/122/4147/2756.jpg" alt="" />
              <div className="caption center-align">
                <h2>Search room</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only">
                  Through BMS you can see all available rooms of each building
                </h5>
                <a href="#" className="btn btn-large">
                  Search bellow
                </a>
              </div>
            </li>
            <li>
              <img src="https://i.picsum.photos/id/122/4147/2756.jpg" alt="" />
              <div className="caption left-align">
                <h2>Book a room</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only">
                  BMS help you to book your favorite room of your business
                </h5>
                <a href="#" className="btn btn-large">
                  Search bellow
                </a>
              </div>
            </li>
            <li>
              <img src="https://i.picsum.photos/id/122/4147/2756.jpg" alt="" />
              <div className="caption right-align">
                <h2>Affordable price</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only">
                  Pick room and be able to book it at an affordable price
                </h5>
                <a href="#" className="btn btn-large">
                  Search bellow
                </a>
              </div>
            </li>
          </ul>
        </section>
        <SearchBuilding />
        <section className="section section-icons grey lighten-4 center">
          <div className="container">
            <div className="row">
              <div className="col s12 m4">
                <div className="card-panel">
                  <i className="material-icons large teal-text">meeting_room</i>
                  <h4>Search room</h4>
                  <p>
                    Through BMS you can see all available rooms of each building
                  </p>
                </div>
              </div>
              <div className="col s12 m4">
                <div className="card-panel">
                  <i className="material-icons large teal-text">store</i>
                  <h4>Book room</h4>
                  <p>
                    BMS help you to book your favorite room of your business
                  </p>
                </div>
              </div>
              <div className="col s12 m4">
                <div className="card-panel">
                  <i className="material-icons large teal-text">
                    monetization_on
                  </i>
                  <h4>Affordable price</h4>
                  <p>Pick room and be able to book it at an affordable price</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LatestAddedBuilding />

        <section className="section section-follow teal darken-2 white-text center">
          <div className="container">
            <div className="row">
              <div className="col s12">
                <h4>Follow BMS</h4>
                <p>Follow us on social media for special offers</p>
                <a href="#" target="_blank" className="white-text">
                  <i className="fab fa-facebook fa-4x" />
                </a>
                <a href="#" target="_blank" className="white-text">
                  <i className="fab fa-twitter fa-4x" />
                </a>
                <a href="#" target="_blank" className="white-text">
                  <i className="fab fa-linkedin fa-4x" />
                </a>
                <a href="#" target="_blank" className="white-text">
                  <i className="fab fa-google-plus fa-4x" />
                </a>
                <a href="#" target="_blank" className="white-text">
                  <i className="fab fa-pinterest fa-4x" />
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

export default LandingPage;
