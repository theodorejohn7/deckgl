import React, { useState, useEffect } from "react"; 
import { GeoJsonLayer } from "@deck.gl/layers";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
// import "@deck.gl/core/dist/styles.css";


const DeckGLMap = ({ selectedLayer }) => {
    const [map, setMap] = useState(null);
    const data = selectedLayer?.data;
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_TOKEN;

    useEffect(() => {
        const googleMapsScript = document.createElement("script");
        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
        googleMapsScript.async = true;
        googleMapsScript.onload = () => {
            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: 37.7749, lng: -122.4194 },
                zoom: 12,
            });
            setMap(map);
        };
        document.body.appendChild(googleMapsScript);
    }, []);

    useEffect(() => {
        if (map) {
            const geoJsonLayer = new GeoJsonLayer({
                id: "geojson-layer",
                data: data,
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
            const overlay = new GoogleMapsOverlay({
                layers: [geoJsonLayer],
            });
            overlay.setMap(map);
        }
    }, [map, data]);

    return <div id="map" style={{ border: '1px solid blue', width: "100%", height: "80vh" }} > </div>;
};

export default DeckGLMap;
