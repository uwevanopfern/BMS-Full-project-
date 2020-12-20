import React from 'react';
import '../App.css';
import {buildings, BEARERTOKEN} from '../store';
import axios from 'axios';

class LatestAddedBuilding extends React.Component {
  state = {
    buildings: [],
  };

  componentDidMount () {
    axios.get (buildings, {headers: {Authorization: BEARERTOKEN}}).then (res => {
      this.setState ({
        buildings: res.data,
      });
    });
  }
  render () {
    return (
      <section id="popular" className="section section-popular scrollspy">
        <div className="container">
          <div className="row">
            <h4 className="center">
              <span className="teal-text">Latest added</span> buildings
            </h4>
            {this.state.buildings.slice (0, 3).map (function (building) {
              return (
                <div className="col s12 m4" key={building.id}>
                  <div className="card">
                    <div className="card-image avatar">
                      <img src={building.avatar} alt="" />
                      <span className="card-title">{building.name}</span>
                    </div>
                    <div className="card-content">
                      <ul className="collection with-header">
                        <li className="collection-item">{building.acronym}</li>
                        <li className="collection-item">
                          {!!building.contact
                            ? building.contact
                            : <div className="no-content">
                                <p>Contact not available</p>
                              </div>}
                        </li>
                        <li className="collection-item">
                          {!!building.email
                            ? building.email
                            : <div className="no-content">
                                <p>Email not available</p>
                              </div>}
                        </li>
                        <li className="collection-item">
                          {!!building.website
                            ? building.website
                            : <div className="no-content">
                                <p>Website not available</p>
                              </div>}
                        </li>
                      </ul>
                      <a href={`buildings/${building.id}`} className="btn btn-small">View details</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row">
            <div className="col s12 center">
              <a href="#contact" className="btn btn-large grey darken-3">
                <i className="material-icons left">send</i> Contact For Booking
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default LatestAddedBuilding;
