// util/RewardAd.js
import {
    RewardedAd,
    RewardedAdEventType,
    TestIds,
  } from "react-native-google-mobile-ads";
  
  const adUnitId =
    __DEV__
      ? TestIds.REWARDED
      : "ca-app-pub-8525673711213815/7369519823"; // ⚠️ Replace with your real rewarded ad ID
  
  let rewardedAd = null;
  let isLoaded = false;
  
  // 🔥 Load Rewarded Ad
  export const loadRewarded = () => {
    rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
  
    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      isLoaded = true;
    });
  
    rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("🎁 Reward earned:", reward);
        if (typeof onEarnReward === "function") {
          onEarnReward(reward);
        }
      }
    );
  
    rewardedAd.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => {
        // Reload immediately after close
        isLoaded = false;
        loadRewarded();
      }
    );
  
    rewardedAd.load();
  };
  
  // Callback placeholder
  let onEarnReward = null;
  
  export const setRewardCallback = (cb) => {
    onEarnReward = cb;
  };
  
  // 🚀 Show Reward Ad
  export const showRewarded = async () => {
    if (isLoaded && rewardedAd) {
      rewardedAd.show();
    } else {
      console.log("⚠️ Rewarded Ad not loaded, loading now...");
      loadRewarded();
    }
  };
  