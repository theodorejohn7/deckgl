import React, { useState, useEffect } from "react";
import { Layout, Menu } from 'antd';
import DeckGLMap from "./components/DeckGLMap";
import LayerForm from "./components/LayerForm";
import { ScatterplotLayer } from "deck.gl";
import LayerList from "./components/LayerList";
import { getLayers, createLayer, deleteLayer } from "./utils/api";
import "./App.css";
// import 'antd/dist/antd.min.css';
import { Drawer, Button } from 'antd';
import CreateMapLayer from "./components/CreateMapLayer";


function App() {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };




  const handleSelectLayer = (layerId) => {
    console.log('Selected layer:', layerId);
    const layer = layers.find(layer => layer.id === layerId.id);
    console.log("@$#appjs layers", layers, layer)
    setSelectedLayer(layer);
  }

  useEffect(() => {
    fetchLayers();
  }, []);

  console.log("@$#app layers", layers)

  const fetchLayers = async () => {
    try {
      const layers = await getLayers();
      setLayers(layers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateLayer = async (layer) => {
    try {
      // const newLayer = await createLayer(layer);
      setLayers([...layers, layer]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLayer = async (layerId) => {
    try {
      await deleteLayer(layerId);
      setLayers(layers.filter((layer) => layer.id !== layerId));
    } catch (error) {
      console.error(error);
    }
  };


  const renderLayers = () => {
    return layers.map(layer => {
      const isLayerSelected = selectedLayer && layer.id === selectedLayer.id;
      const opacity = isLayerSelected ? 0.8 : 0.5;
      const color = isLayerSelected ? [255, 0, 0] : layer.color;
      return (
        <ScatterplotLayer
          key={layer.id}
          data={layer.data}
          getPosition={layer.getPosition}
          getColor={color}
          getRadius={layer.getRadius}
          opacity={opacity}
        />
      );
    });
  };

  return (
    <div className="App">

      <Drawer
        title="Map Layers"
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <div className="sidebar">

          <LayerList appLayers={layers} onSelect={handleSelectLayer} onDeleteLayer={handleDeleteLayer} />
        </div>
      </Drawer>

      <div className="map-container">

         <DeckGLMap layers={renderLayers()} selectedLayer={selectedLayer} />
        <div style={{ display: 'flex' }}>

          {/* <LayerForm onCreate={handleCreateLayer} /> */}
          {/* <CreateMapLayer locationData={selectedLayer} /> */}
          <Button type="primary" onClick={showDrawer}>
            View Layers
          </Button>
        </div>
      </div>



    </div>
  );
}

export default App;

