// utils/InterstitialAd.js
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";

const AD_UNIT_ID = "ca-app-pub-8525673711213815/1730180332";

let interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

let isLoaded = false;

export function loadInterstitial(setLoaded) {
  // reset flags
  isLoaded = false;
  setLoaded(false);

  requestAnimationFrame(() => {
    const unsubLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isLoaded = true;
        setLoaded(true);
      }
    );

    const unsubError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        isLoaded = false;
        setLoaded(false);
      }
    );

    interstitial.load();

    return () => {
      unsubLoaded();
      unsubError();
    };
  });
}

export function showInterstitial() {
  if (!isLoaded) return false;

  interstitial.show();

  // recreate instance AFTER showing
  interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  isLoaded = false;
  return true;
}
