import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";

const AD_UNIT_ID = "ca-app-pub-8525673711213815/1730180332";

let interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

let isLoaded = false;

export function loadInterstitial(setLoaded) {
  // RESET FLAG
  isLoaded = false;
  setLoaded(false);

  const unsubscribeLoaded = interstitial.addAdEventListener(
    AdEventType.LOADED,
    () => {
      isLoaded = true;
      setLoaded(true);
    }
  );

  const unsubscribeError = interstitial.addAdEventListener(
    AdEventType.ERROR,
    () => {
      isLoaded = false;
      setLoaded(false);
    }
  );

  interstitial.load();

  // Clean listeners on reload
  return () => {
    unsubscribeLoaded();
    unsubscribeError();
  };
}

export function showInterstitial() {
  if (!isLoaded) return false;
  interstitial.show();

  // After showing, create a NEW instance for next load
  interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID);
  isLoaded = false;

  return true;
}
