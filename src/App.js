import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { useEffect, useState } from 'react';
import LocationInfoBox from './components/LocationInfoBox';
import Header from './components/Header';
function App() {

  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch('https://eonet.sci.gsfc.nasa.gov/api/v2.1/events');
      const { events } = await res.json();
      setEventData(events);
      setLoading(false);
    };

    fetchData();
  }, []);


  const iconMarkup = renderToStaticMarkup(<i className="fas fa-fire location-icon"></i>);

  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  const position = [42.3265, -122.8756];

  let map;
  if (loading)
    map = <div className="loader">Loading...</div>
  else
    map = (
      <MapContainer center={position} zoom={6} scrollWheelZoom={true} className="map" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          eventData.map(ev => {
            if (ev.categories[0].id === 8) {
              return (
                <Marker
                  position={[ev.geometries[0].coordinates[1], ev.geometries[0].coordinates[0]]}
                  icon={customMarkerIcon}
                >
                  <Popup>
                    <LocationInfoBox info={{id: ev.id, title: ev.title}}/>
                  </Popup>
                </Marker>
              )
            } return null;
          })
        }
        
      </MapContainer>
    );

  return (
    <div>
      <Header />
      {map}
    </div>
  );
}

export default App;
