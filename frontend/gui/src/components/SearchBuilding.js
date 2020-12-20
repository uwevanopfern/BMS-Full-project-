import React from 'react';
import '../App.css';
import {searchBuilding, BEARERTOKEN} from '../store';
import axios from 'axios';

class SearchBuilding extends React.Component {
  state = {
    buildings: [],
    searchInput: '',
  };

  componentDidMount () {
    const params = '';
    axios
      .get (searchBuilding (params), {
        headers: {Authorization: BEARERTOKEN},
      })
      .then (res => {
        this.setState ({
          buildings: res.data,
        });
      });
  }

  addEventListener = e => {
    this.setState ({searchInput: e.target.value});
  };

  render () {
    const filterData = this.state.buildings.filter (building =>
      building.name
        .toLowerCase ()
        .includes (this.state.searchInput.toLowerCase ())
    );
    const renderBuilding = filterData.map (item => {
      var link = window.location.origin;
      return (
        (
          <li key={item.id} class="collection-item">
            <div>
              <span className="teal-text">{item.name}</span>
              <a
                href={`${link}/buildings/${item.id}`}
                className="secondary-content teal-text"
              >
                View details
              </a>
            </div>
          </li>
        )
      );
    });
    return (
      <section
        id="search"
        className="section section-search teal darken-1 white-text center scrollspy"
      >
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4>Search buildings and book a room of your business on BMS</h4>
              <div className="input-field">
                <input
                  onChange={this.addEventListener}
                  className="white grey-text autocomplete center"
                  placeholder="Search by building name, address and see available rooms"
                  type="text"
                  id="autocomplete-input"
                />
                <ul className="collection" style={{marginTop: -10}}>
                  {!!this.state.searchInput ? renderBuilding : ''}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default SearchBuilding;
