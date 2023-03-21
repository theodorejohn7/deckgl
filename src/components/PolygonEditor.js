import { EditControl } from "react-leaflet-draw";
import { useCallback, useState } from "react";

const PolygonEditor = ({ onPolygonCreated }) => {
  const [layer, setLayer] = useState(null);

  const handleCreated = useCallback((e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      setLayer(layer);
      onPolygonCreated(layer.toGeoJSON());
    }
  }, [onPolygonCreated]);

  const handleEdited = useCallback((e) => {
    setLayer(e.layers.getLayers()[0]);
    onPolygonCreated(e.layers.toGeoJSON());
  }, [onPolygonCreated]);

  return (
    <EditControl
      position="topright"
      onCreated={handleCreated}
      onEdited={handleEdited}
      onDeleted={() => {
        setLayer(null);
        onPolygonCreated(null);
      }}
      draw={{
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      }}
      edit={{
        edit: !!layer,
        remove: !!layer,
      }}
    />
  );
};

export default PolygonEditor;