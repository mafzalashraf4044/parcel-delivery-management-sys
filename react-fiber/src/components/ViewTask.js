import React from 'react';

//  third party libraries
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

//  third party components
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox";

//  styles
import './ViewTask.css';

//  redux
import { connect } from 'react-redux';
import * as Actions from '../actions';

//  constants
import { LOCATION_LABELS } from '../constants';

class ViewTask extends React.Component {
    constructor(props) {
        super(props);

        this.geocoder = new window.google.maps.Geocoder();
        
        this.state = {
          showMarkersData: false,
          viewPath: false,
          task: this.props.task,
          yourAddress: '',
        };
    }

    toggleMarkersData = () => {
      this.setState(prevState => ({
        showMarkersData: !prevState.showMarkersData,
      }));
    }

    toggleViewPath = () => {
      this.setState(prevState => ({
        viewPath: !prevState.viewPath,
      }))
    }

    onSearchBoxMounted =  ref => {
      this.searchBoxRef = ref;
    }
  
    onPlacesChanged = (e) => {
      const places = this.searchBoxRef.getPlaces();

      const newMarker = places.map(place => ({location: place.geometry.location, label: 'A', place: place.formatted_address, address: 'your-address'}));
   
      const task = Object.assign({}, this.state.task);

      if (this.state.yourAddress) {
        task.markers.splice(0, 1);
      }

      task.markers = [...newMarker, ...task.markers];

      this.setState({
        task,
        yourAddress: newMarker[0].place,
      });
    }

    calculatePath = () => {
      if (!this.props.directions){
        const timeNow = Date.now()/1000;
        this.props.setLoader(true);

        this.props.getMinDistance({markers: this.state.task.markers}).then((res) => {
            if (res.status === 200) {

              console.log('Algo Started', Date.now()/1000 - timeNow);
              
              const markersAsOrigin = res.data.data.markersAsOrigin;

              for (let i = 0; i < markersAsOrigin.length; i++) {
                markersAsOrigin[i].splice(i, 0, undefined);
              }
        
              let visited = [];
              let minDestinations = [];
              let currentOrigin = 'A';
              
              for (let i = 0; i < markersAsOrigin.length; i++) {
                  if ( LOCATION_LABELS.indexOf(currentOrigin) < 0) {
                      break;
                  }
                      
                  visited.push(currentOrigin);
        
                  let destinations = markersAsOrigin[LOCATION_LABELS.indexOf(currentOrigin)].filter((destination, index) => {
                      return destination && visited.indexOf(destination.label) === -1;
                  });
        
                  if (destinations.length === 0) {
                      const origin = markersAsOrigin[LOCATION_LABELS.indexOf(currentOrigin)];
        
                      minDestinations.push({
                        index: currentOrigin,
                        // eslint-disable-next-line
                        origin: _.find(this.state.task.markers, (o) => o.label === currentOrigin),
                        minDestination: _.find(origin, (o) => o.label === 'A'),
                        visited: _.clone(visited),
                        nextOrigin: null,
                      });
    
                      break;
                  }
        
                  const minDestination = _.minBy(destinations, destination => destination.distance);
        
                  minDestinations.push({
                    index: currentOrigin,
                    // eslint-disable-next-line
                    origin: _.find(this.state.task.markers, (o) => o.label === currentOrigin),
                    minDestination: minDestination,
                    visited: _.clone(visited),
                    nextOrigin: minDestination.label,
                  });
                  currentOrigin = minDestination.label;
              }
              
              console.log('Algo Finished', Date.now()/1000 - timeNow);
              console.log("minDestinations", minDestinations.reduce((sum, destination) => sum + destination.minDestination.distance, 0));
              console.log("minDestinations", minDestinations.reduce((sum, destination) => sum + ' -> ' + destination.minDestination.label, 'A'));
              console.log("minDestinations", minDestinations.reduce((sum, destination) => sum + ' -> ' + destination.minDestination.address, 'your-address'));
        
              this.toggleViewPath();
      
              let waypts = [];
              
              minDestinations.forEach((minDestination, index) => {
                if (minDestination.index !== 'A') {
                  waypts.push({
                    location: minDestination.origin.location,
                  });
                }
              });
    
              const DirectionsService = new window.google.maps.DirectionsService();
              
              DirectionsService.route({
                origin: minDestinations[0].origin.location,
                destination: minDestinations[0].origin.location,
                waypoints: waypts,
                travelMode: window.google.maps.TravelMode.DRIVING,
              }, (result, status) => {
                this.props.setLoader(false);
                if (status === window.google.maps.DirectionsStatus.OK) {
                  this.props.setDirections(result);
                } else {
                  this.props.setResponseMsg(res.data.data.msg);
                }
              });

            }
        }).catch((err) => {
          console.log("err", err);
          this.props.setLoader(false);
          this.props.setResponseMsg(err.response.data.msg);
        });
      } else {
        this.toggleViewPath();
      }
    }

    render() {
        return (
            <div className={`view-task-container paper-container ${this.state.viewPath > 0 && 'view-path'}`}>
                <Paper className="view-task-paper paper" zDepth={2}>
                    <div className="header">
                        Task
                    </div>

                    <div className="view-task-form form">
                        {
                          !this.state.showMarkersData ? 
                          <div className="other-data">
                            <div className="assigned-to input-field">
                              <TextField
                                type="text"
                                fullWidth
                                floatingLabelText="Status"
                                value={this.state.task.isCompleted ? 'Completed' : 'Not Completed'}
                              />
                            </div>

                            <div className="task-date input-field">
                              <TextField
                                type="text"
                                fullWidth
                                floatingLabelText="Date"
                                value={moment(this.state.task.date).format('YYYY-MM-DD')}
                              />
                            </div>

                            <div className="amount input-field">
                                <TextField
                                  type="text"
                                  fullWidth
                                  floatingLabelText="Amount"
                                  value={this.state.task.amount}
                                />
                            </div>

                            <div className="your-location input-field">
                              <StandaloneSearchBox
                                ref={this.onSearchBoxMounted}
                                onPlacesChanged={this.onPlacesChanged}
                              >
                                <TextField
                                  type="text"
                                  fullWidth
                                  floatingLabelText="Your Location"
                                  defaultValue={this.state.yourAddress}
                                />
                              </StandaloneSearchBox>
                            </div>

                          </div> :
                          <div className="markers-data">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHeaderColumn style={{width: '30px'}}>Lable</TableHeaderColumn>
                                  <TableHeaderColumn>Location</TableHeaderColumn>
                                  <TableHeaderColumn>Address</TableHeaderColumn>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                  this.state.task.markers.map((marker, index) => {
                                    return (
                                      <TableRow>
                                        <TableRowColumn style={{width: '30px'}}>{marker.label}</TableRowColumn>
                                        <TableRowColumn>{marker.place}</TableRowColumn>
                                        <TableRowColumn>{marker.address}</TableRowColumn>
                                      </TableRow>
                                    );
                                  })
                                }
                              </TableBody>
                            </Table>
                          </div>
                        }
                    </div>
                    <div className="actions">
                        <div className="actions-left">
                          {
                            this.state.task.markers[0].label === 'A' &&
                            <FlatButton label="View Path" primary onClick={this.calculatePath} />
                          }
                          {
                            (this.state.task.markers[0].label === 'A' && this.state.task.markers.length > 0) &&
                            <IconButton
                              className="next-prev"
                              onClick={this.toggleMarkersData}
                              iconClassName={`zmdi zmdi-chevron-${this.state.showMarkersData ? 'left' : 'right'}`}
                            />
                          }
                        </div>
                        <div className="action-right">
                          <FlatButton label="Close" labelStyle={{ color: 'red' }} onClick={this.props.close} />
                        </div>
                    </div>
                    {
                      this.state.viewPath > 0 &&
                      <div
                          className="toggle-view-path-btn"
                          onClick={this.toggleViewPath}>
                          <FontIcon className="zmdi zmdi-caret-left"/>
                      </div>
                    }
                </Paper>
            </div>
        );
    }
}

ViewTask.propTypes = {
  task: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  markersLimit: state.markersLimit,
  markers: state.markers,
  directions: state.directions,
});

const mapDispatchToProps = (dispatch) => ({
  setMarkersLimit: markersLimit => dispatch(Actions.setMarkersLimit(markersLimit)),
  saveMarkers: markers => dispatch(Actions.saveMarkers(markers)),
  setDirections: directions => dispatch(Actions.setDirections(directions)),
  getMinDistance: markers => dispatch(Actions.getMinDistance(markers)),
  setLoader: loader => dispatch(Actions.setLoader(loader)),
  setResponseMsg: responseMsg => dispatch(Actions.setResponseMsg(responseMsg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewTask);