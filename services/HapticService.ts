import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../store/settingsStore';

class HapticService {
  private static instance: HapticService;

  static getInstance(): HapticService {
    if (!HapticService.instance) {
      HapticService.instance = new HapticService();
    }
    return HapticService.instance;
  }

  async triggerHaptic(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) {
    const { hapticsEnabled } = useSettingsStore.getState();
    if (hapticsEnabled) {
      await Haptics.impactAsync(style);
    }
  }
}

export default HapticService.getInstance();
