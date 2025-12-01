import { Platform } from "react-native";
import LottieView from "lottie-react-native";  // for native
import Lottie from "lottie-react";             // for web

export default function AnimatedLottie({ source, style, loop = true, autoPlay = true }) {
  if (Platform.OS === "web") {
    return (
      <Lottie
        animationData={source}
        loop={loop}
        autoplay={autoPlay}
        style={style}
      />
    );
  }

  return (
    <LottieView
      source={source}
      loop={loop}
      autoPlay={autoPlay}
      style={style}
    />
  );
}
