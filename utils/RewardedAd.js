import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : "ca-app-pub-8525673711213815/7369519823";

let rewardedInterstitial = null;
let isLoaded = false;
let rewardCallback = null;

export function loadRewardedInterstitial(setLoaded) {
  console.log("🔄 Loading rewarded interstitial…");

  rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Listen for AD LOADED
  rewardedInterstitial.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      console.log("✅ Rewarded Interstitial Loaded!");
      isLoaded = true;
      setLoaded(true);
    }
  );

  // Listen for REWARD
  rewardedInterstitial.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    () => {
      console.log("🎉 User Earned Reward!");
      rewardCallback && rewardCallback();
    }
  );

  rewardedInterstitial.load();
}

export function setRewardCallback(cb) {
  rewardCallback = cb;
}

export function showRewardAd() {
  if (!isLoaded || !rewardedInterstitial) {
    console.log("❌ Tried to show ad but NOT loaded!");
    return false; // IMPORTANT
  }

  rewardedInterstitial.show();
  isLoaded = false;

  return true;
}
