import React, { Component} from 'react';
import { getWalkTime, getTimes, timeToString } from '../../utils/index';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class ServiceEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      openUntil: null,
    };

    this.getOpenInformation = this.getOpenInformation.bind(this);
  }
  
  componentDidMount() {
    this.getOpenInformation(this.props.hit.schedule);
  }

  getOpenInformation(scheduleDays) {
    const openInfo = getTimes(scheduleDays);
    this.setState({
      isOpen: openInfo.isOpen,
      openUntil: openInfo.openUntil,
      is24hour: openInfo.is24hour,
    });
  }

  render() {
    let { hit, userLocation } = this.props;
    const { isOpen, openUntil, is24hour } = this.state;
    const description = hit.long_description || 'No description, yet...';
    let timeInfo = null;
    if (isOpen) {
      if(is24hour) {
        timeInfo = 'Open 24 hours';
      } else {
        timeInfo = `Open Until ${timeToString(openUntil)}`;
      }
    } else {
      timeInfo = 'Closed';
    }

    return (
    <li className="results-table-entry service-entry">
      <header>
        <div className="entry-details">
          <h4 className="entry-headline">{hit.name}</h4>
          <div className="entry-subhead">
            <p className="entry-affiliated-resource">a service offered by <Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>{hit.service_of}</Link></p>
            <p>{`${hit.addresses.address_1} • ${timeInfo}`}</p>
          </div>
        </div>
      </header>
      <div className="line-break" />
       <div className="entry-additional-info">
        <div className="entry-tabs">
          <p>Description</p>
        </div>
        <div className="entry-body">
          <p>{description}</p>
        </div>
      </div>
      <div className="entry-action-buttons">
        <ul className="action-buttons">
          <li className="action-button"><Link to={{ pathname: `/service/${hit.service_id}` }}>Details</Link></li>
          <li className="action-button">
            <a href={`https://maps.google.com?saddr=Current+Location&daddr=${hit._geoloc.lat},${hit._geoloc.lng}&dirflg=w`}
              target="_blank"
              rel="noopener noreferrer"
              >
                Directions
            </a>
          </li>
        </ul>
      </div>

    </li>
  );
  }
};


function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps) (ServiceEntry);