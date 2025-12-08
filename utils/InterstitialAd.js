// util/InterstitialAd.js

import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";

const AD_UNIT_ID = "ca-app-pub-8525673711213815/1730180332"; // YOUR interstitial ad ID

export const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

export function loadInterstitial(setLoaded) {
  interstitial.load();

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    setLoaded(true);
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    setLoaded(false);
  });
}

export function showInterstitial() {
  interstitial.show();
}
