import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LocationSubscriber } from "expo-location/build/LocationSubscribers";

import { ThemedText } from "../../components/ThemedText";

const LOCATION_DISTANCE_THRESHOLD = 1;

const Home = () => {
  const [GeoCodedLocation, setGeoCodedLocation] = useState();
  const [UserLat, setUserLat] = useState();
  const [UserLong, setUserLong] = useState();
  const [Address, setAddress] = useState();
  const [Accuracy, setAccuracy] = useState();

  useEffect(() => {
    let subs = LocationSubscriber;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      subs = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: LOCATION_DISTANCE_THRESHOLD,
        },
        (location) => {
          const { coords } = location;
          const { latitude, longitude, accuracy } = coords;
          console.log("Lat", latitude);
          console.log("Long", longitude);
          console.log("Accuracy", accuracy);
          setUserLong(longitude);
          setUserLat(latitude);
          setAccuracy(accuracy);
        }
      );
    })();

    return () => {
      if (subs) {
        subs.remove();
      }
    };
  }, []);

  const geocode = async () => {
    const geocodedLocation = await Location.geocodeAsync(address);
    console.log(geocodedLocation);
    setGeoCodedLocation(geocodedLocation);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ThemedText>Latitude {UserLat} </ThemedText>
      <ThemedText>Latitude {UserLong} </ThemedText>
      <ThemedText>Accuracy {Accuracy} </ThemedText>
      <View
        style={{
          marginTop: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          inputMode="text"
          placeholder="Enter address"
          onChange={(e) => setAddress(e.target.value)}
          style={{
            backgroundColor: "#e7e7e7",
            width: 150,
            paddingLeft: 36,
            height: 35,
            borderRadius: 10,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#ff7a3d",
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <ThemedText style={{ padding: 10 }}>Get GeoCoded location</ThemedText>
        </TouchableOpacity>
        <ThemedText style={{ marginTop: 10 }}>
          Geocoded location {GeoCodedLocation}
        </ThemedText>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
