import React from "react";

//  third party libraries
import PropTypes from 'prop-types';

//  google maps
import { compose, withProps } from "recompose";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "react-google-maps";

//  constants
import { LOCATION_LABELS } from '../constants';

class GoogleMapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.geocoder = new window.google.maps.Geocoder();
    this.delayIndex = 0;
    this.state = {
      infoWindowIndex: -1,
    }

    console.log('gello world');
  }

  componentWillReceiveProps(newProps) {
    if (this.props.markers.length !== newProps.markers.length) {
      newProps.markers.forEach(this.getPlaceFromMarker);
    }
  }

  getPlaceFromMarker = (marker, index)=>  {
    if (marker.place === '') {
      this.geocoder.geocode({location: marker.location}, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          this.delayIndex = this.delayIndex + 1;
          setTimeout(() => {
            this.delayIndex = 0;
            this.getPlaceFromMarker(marker, index);
          }, this.delayIndex * 500)
        } else {
          const markers = this.props.markers;
          markers[index].place = results[0].formatted_address;
          this.props.saveMarkers(markers);
        }
      });
    }
  }

  addMarker = (e) => {
    if (this.props.markersLimit > 0 && this.props.markers.length < this.props.markersLimit) {
      const markers = [...this.props.markers, {
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        },
        label: LOCATION_LABELS[this.props.markers.length + 1],
        place: '',
        address: ''
      }, ];
      this.props.saveMarkers(markers);
    }
  }

  clearMarkers = () => {
    this.setState({
      markers: [],
    });
  }

  onSearchBoxMounted =  ref => {
    this.searchBoxRef = ref;
  }

  onPlacesChanged = () => {
    const places = this.searchBoxRef.getPlaces();
    const newMarker = places.map(place => ({
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      label: LOCATION_LABELS[this.props.markers.length + 1],
      place: '',
      address: ''
    }));
 
    this.props.saveMarkers([...this.props.markers, ...newMarker]);
  }

  setInfoWindowIndex = (infoWindowIndex) => {
    this.setState({
      infoWindowIndex,
    });
  }

  removeMarker = (index) => {
    const markers = [...this.props.markers];
    markers.splice(index, 1);
    this.props.saveMarkers(markers);
  }

  render() {
    return (
      <div className="google-map-container">
        <GoogleMap
          defaultZoom={14}
          defaultCenter={{ lat: 24.94349523800371, lng: 67.09771156311035 }}
          onClick={this.addMarker}
        >
          {this.props.directions && <DirectionsRenderer directions={this.props.directions} />}

          {
            this.props.markers.map((marker, index) => 
              <Marker
                key={index}
                onClick={() => this.setInfoWindowIndex(index)}
                position={{ lat: marker.location.lat, lng: marker.location.lng }}
              >
                {
                  this.state.infoWindowIndex === index &&
                  <InfoWindow onCloseClick={() => this.setInfoWindowIndex(-1)}>
                    <span
                      style={{cursor: 'pointer'}}
                      onClick={() => this.removeMarker(index)}
                    >Remove</span>
                  </InfoWindow>
                }
              </Marker>
            )
          }

          {
            (this.props.markersLimit > 0 && this.props.markers.length < this.props.markersLimit) &&
            <SearchBox
              ref={this.onSearchBoxMounted}
              controlPosition={window.google.maps.ControlPosition.TOP_CENTER}
              onPlacesChanged={this.onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Search here..."
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `440px`,
                  height: `32px`,
                  marginTop: `27px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                }}
              />
            </SearchBox>
          }
        </GoogleMap>

      </div>
    )
  }
}

GoogleMapContainer.propTypes = {
  saveMarkers: PropTypes.func.isRequired,
  markersLimit: PropTypes.number.isRequired,
};

export default compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBJ_N-FztvixVMGM_dxBShcgySNowB3XTM&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh`, overflow: 'hidden', }} />,
    mapElement: <div style={{ height: `100%` }} />,
    disableDefaultUI: true,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMapContainer {...props} />
);