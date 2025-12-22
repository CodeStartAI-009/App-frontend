// utils/RewardedAd.js
import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : "ca-app-pub-8525673711213815/7369519823";

let rewardedAd = RewardedInterstitialAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

let isLoaded = false;
let rewardCallback = null;

export function loadRewardedInterstitial(setLoaded) {
  isLoaded = false;
  setLoaded(false);

  requestAnimationFrame(() => {
    const unsubLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isLoaded = true;
        setLoaded(true);
      }
    );

    const unsubReward = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        rewardCallback && rewardCallback();
      }
    );

    rewardedAd.load();

    return () => {
      unsubLoaded();
      unsubReward();
    };
  });
}

export function setRewardCallback(cb) {
  rewardCallback = cb;
}

export function showRewardAd() {
  if (!isLoaded) return false;

  rewardedAd.show();

  rewardedAd = RewardedInterstitialAd.createForAdRequest(AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  isLoaded = false;
  return true;
}
