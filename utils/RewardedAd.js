import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : "ca-app-pub-8525673711213815/7369519823";

let rewardedAd = RewardedInterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

let isLoaded = false;
let rewardCallback = null;

export function loadRewardedInterstitial(setLoaded) {
  isLoaded = false;
  setLoaded(false);

  const unsubLoaded = rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      isLoaded = true;
      setLoaded(true);
    }
  );

  const unsubEarn = rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    () => {
      rewardCallback && rewardCallback();
    }
  );

  rewardedAd.load();

  return () => {
    unsubLoaded();
    unsubEarn();
  };
}

export function setRewardCallback(cb) {
  rewardCallback = cb;
}

export function showRewardAd() {
  if (!isLoaded) return false;

  rewardedAd.show();

  // After showing → create new instance
  rewardedAd = RewardedInterstitialAd.createForAdRequest(adUnitId);
  isLoaded = false;

  return true;
}
