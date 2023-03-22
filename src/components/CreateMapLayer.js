import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, Polygon, useLoadScript } from '@react-google-maps/api';
import { Input, Button, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons'; 
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const CreateMapLayer = () => {
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center of San Francisco
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [layerInput, setLayerInput] = useState('')
  const [mapRef, setMapRef] = useState(null);
  const LAYER_API_URL = "http://localhost:3001/layers";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_TOKEN,
  });

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
  }, []);

  const handlePolygonClick = () => {
    
    setPolygonPaths([]);
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPolygonPaths([...polygonPaths, { lng, lat }]);
  };
   
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    if (searchInput.trim() === '') {
      message.warning('Please enter a valid search query');
      return;
    }

    // Get the geocode of the search query and update the map center
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
        if (mapRef) {
          mapRef.panTo({ lat: lat(), lng: lng() });
        }
      } else {
        message.error('Could not find the location. Please try again.');
      }
    });
  };

   

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
  };

  const mapContainerStyle = {
    height: '70vh',
    width: '100vw',
  };

  const myUuid = uuidv4();


  const createLayer = async (values) => {

    let temp = {};
    temp["id"] = myUuid;
    temp["name"] = layerInput;
    temp["data"] = values;

    try {
       await axios.post(`${LAYER_API_URL}`, temp);

      message.success(`${layerInput} Layer created successfully!`);
      setPolygonPaths([])

    } catch (error) {
      console.error(error);
      message.error("Failed to create layer");
    }
  };


  const handleCreateLayer = () => {


    const newLayer = {
      type: 'FeatureCollection',
      features:

        [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [polygonPaths.map(obj => Object.values(obj))],
              "type": "Polygon"
            }
          }]
    }

    createLayer(newLayer)
  }

  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
        <Input.Search
          placeholder="Search location"
          enterButton={<EnvironmentOutlined />}
          size="large"
          value={searchInput}
          onChange={handleInputChange}
          onSearch={handleSearch}
          style={{ width: '40%' }}
        />

        <Input
          placeholder="Layer Name"
          // enterButton={<EnvironmentOutlined />}
          size="large"
          value={layerInput}
          onChange={(event) => { setLayerInput(event.target.value) }}
          // onSearch={handleSearch}
          style={{ width: '10%' }}
        />


        <Button onClick={handleCreateLayer} 
        disabled={!(polygonPaths.length>2 && layerInput)}
        >Create Layer</Button>
      </div>
      {isLoaded && (
       
       <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          options={mapOptions}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {polygonPaths.length > 0 && <Polygon paths={polygonPaths} onClick={handlePolygonClick} />}
          <Marker position={center} />

        </GoogleMap>
      )}
    </div>
  )
}

export default CreateMapLayer;  