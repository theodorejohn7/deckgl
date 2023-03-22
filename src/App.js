import React, { useState, useEffect } from "react";
import { Layout, Menu } from 'antd';
import DeckGLMap from "./components/DeckGLMap";
import LayerList from "./components/LayerList";
import { getLayers, deleteLayer } from "./utils/api";
import "./App.css";
import { Drawer, Button } from 'antd';
import CreateMapLayer from "./components/CreateMapLayer";


function App() {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [visible, setVisible] = useState(false);


  const { Header, Content } = Layout;
  const [activeMenu, setActiveMenu] = useState('home');

  const handleMenuClick = (menuKey) => {
    setActiveMenu(menuKey);
  }


  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };




  const handleSelectLayer = (layerId) => {

    const layer = layers.find(layer => layer.id === layerId.id);

    setSelectedLayer(layer);
  }

  useEffect(() => {
    fetchLayers();
  }, []);

  const fetchLayers = async () => {
    try {
      const layers = await getLayers();
      setLayers(layers);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(()=>{
  fetchLayers();
},[visible])

  const handleDeleteLayer = async (layerId) => {
    try {
      await deleteLayer(layerId);
      setLayers(layers.filter((layer) => layer.id !== layerId));
    } catch (error) {
      console.error(error);
    }
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
          <LayerList open={visible} appLayers={layers} onSelect={handleSelectLayer} onDeleteLayer={handleDeleteLayer} />
        </div>
      </Drawer>

      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" selectedKeys={[activeMenu]} onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="create">Create Layer</Menu.Item>
            <Menu.Item key="view">View Layer</Menu.Item>
          </Menu>
        </Header>
        <Content  >
          {activeMenu === 'create' &&
            <CreateMapLayer locationData={selectedLayer} />
          }
          {activeMenu === 'view' && <>
            <Button type="primary" onClick={showDrawer}
              style={{ position: "absolute", top: "65px", zIndex: 99 }}
            >
              View Layers
            </Button>
            <DeckGLMap selectedLayer={selectedLayer} />
          </>}
        </Content>
      </Layout>


    </div >
  );
}

export default App;

