/* global google */
import "./App.css";
import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

/* Hook databse with React App */

const firebaseConfig = {
  apiKey: "AIzaSyBGQnBS_FAF7xkxuc73_G5Um5XUnQ4NN0w",
  authDomain: "wasteinput.firebaseapp.com",
  databaseURL:
    "https://wasteinput-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wasteinput",
  storageBucket: "wasteinput.appspot.com",
  messagingSenderId: "62047734231",
  appId: "1:62047734231:web:93bb227bceef08b6116392",
};

/* MAP Features & Small Design */

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const mapOptions = {
  fullscreenControl: false,
  fullscreenControlOptions: {
    position: 10,
  },
  disableDefaultUI: true,
  styles: [
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      stylers: [{ visibility: "on" }],
    },
  ],
};

const center = {
  lat: 46.755852,
  lng: 23.594432,
};

///////////

var markers2 = [
  {
    lat: 46.754516,
    lng: 23.596608,
    p_rate_percent_color_coding: "red",
    index: 1,
  },
  {
    lat: 46.751362,
    lng: 23.594867,
    p_rate_percent_color_coding: "yellow",
    index: 2,
  },
  {
    lat: 46.754986,
    lng: 23.592378,
    p_rate_percent_color_coding: "green",
    index: 3,
  },
];

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA_phYsSvp-0Jh-M9dggJgl-dkUQy76xP0",
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [selected, setSelected] = React.useState(null);

  if (loadError) return "ERROR LOADING MAP";
  if (!isLoaded) return "LOADING";
  console.log("Working ");

  var markers = [];

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getDatabase(firebaseApp);
  // this.setState({ marker: [] });

  const firebaseRef = ref(db, "GarbageData");
  onValue(firebaseRef, (snapshot) => {
    console.log("CHANGED " + markers);
    markers = [];
    console.log(markers);
    snapshot.forEach(function (childSnapshot) {
      var value = childSnapshot.val();
      var color_coding;
      value.pollution_rate < 40
        ? (color_coding = "green")
        : value.pollution_rate < 70
        ? (color_coding = "yellow")
        : (color_coding = "red");
      markers.push({
        lat: value.lat,
        lng: value.log,
        p_rate_percent: value.pollution_rate,
        p_rate_color_coding: color_coding,
        index: value.index,
      });
    });
  });

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={18}
        center={center}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            index={marker.index}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: "mark_" + marker.p_rate_color_coding + ".png",
              scaledSize: new window.google.maps.Size(100, 100),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(50, 50),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>Garbage#{selected.index}</h2>
              <p>
                Risk:{" "}
                {selected.p_rate_color_coding == "green"
                  ? "LOW"
                  : selected.p_rate_color_coding == "yellow"
                  ? "MEDIUM"
                  : "HIGH"}
              </p>
              <p></p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
