import "expo-router/entry";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

export default function App() {
  useEffect(() => {
    // Initialize Google Mobile Ads
    mobileAds()
      .initialize()
      .then(() => {
        console.log("Google Mobile Ads Initialized ✔");
      });
  }, []);

  return null; // expo-router handles rendering
}
