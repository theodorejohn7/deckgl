import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, Polygon, useLoadScript } from '@react-google-maps/api';
import { Input, Button, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { GeoJsonLayer } from "@deck.gl/layers";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const CreateMapLayer = () => {
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center of San Francisco
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [layerInput, setLayerInput] = useState('')
  const [mapRef, setMapRef] = useState(null);
  const LAYER_API_URL = "http://localhost:3001/layers";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_TOKEN,
  });

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
  }, []);

  const handlePolygonClick = () => {
    // Clear the current polygon
    // console.log()
    setPolygonPaths([]);
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPolygonPaths([...polygonPaths, { lat, lng }]);
  };
  console.log("@$# polypath", polygonPaths)
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

  const handleCreatePolygon = () => {
    if (polygonPaths.length === 0) {
      message.warning('Please draw a polygon on the map');
      return;
    }

    const coordinates = polygonPaths.map(({ lat, lng }) => ({ lat, lng }));
    message.success(`Polygon created with coordinates: ${JSON.stringify(coordinates)}`);
  };

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
  };

  const mapContainerStyle = {
    height: '80vh',
    width: '100vw',
  };

  const myUuid = uuidv4();


  const createLayer = async (values) => {
    console.log("@$#33333333333333333333333333333333333")
    let temp = {};
    temp["id"] = myUuid;
    temp["name"] = layerInput;
    temp["data"] = values;

    try {
      const response = await axios.post(`${LAYER_API_URL}`, temp);
      const layer = response.data;
      message.success("Layer created successfully!");

    } catch (error) {
      console.error(error);
      message.error("Failed to create layer");
    }
  };


  const handleCreateLayer = () => {
    const geoJsonLayer = new GeoJsonLayer({
      id: "geojson-layer",
      data: polygonPaths,
      stroked: false,
      filled: true,
      extruded: true,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 20,
      getFillColor: [255, 200, 0, 160],
      getLineColor: [255, 200, 0],
      getRadius: 100,
      opacity: 1,
      lineWidthMinPixels: 1,
      pickable: true,
      onClick: (event) => console.log(event),
    });
    console.log('@$#121 polygonPaths', polygonPaths, geoJsonLayer)

    createLayer(geoJsonLayer)

  }

  return (
    <div>
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


        <Button onClick={handleCreateLayer}>Create Layer</Button>
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