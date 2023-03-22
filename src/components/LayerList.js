import React, { useEffect, useState } from "react";
import { List, message, Button, Popconfirm } from "antd";
import axios from "axios";

const LAYER_API_URL = "http://localhost:3001/layers";

const LayerList = ({ open,onSelect, appLayers }) => {
  const [layers, setLayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(LAYER_API_URL);
      setLayers(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load layers");
    }
    setIsLoading(false);
  };
  const handleDelete = async (layerId) => {
    try {
      await axios.delete(`${LAYER_API_URL}/${layerId}`);
      message.success("Layer deleted successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete layer");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=>{
    fetchData();

  },[appLayers,open])

  return (
    <div>
      <h2>Layers</h2>
      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={layers}
        renderItem={(layer) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => onSelect(layer)}>
                View Map
              </Button>,
              <Popconfirm
                title="Are you sure you want to delete this layer?"
                onConfirm={() => handleDelete(layer.id)}
              >
                <Button type="danger">Delete</Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta title={layer.name} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default LayerList;
