import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

export const SOUNDS = {
  SPLASH: require('../assets/sounds/splash.mp3'),
  HOME_AMBIENT: require('../assets/sounds/ambient.mp3'),
  MISSION_START: require('../assets/sounds/mission_start.mp3'),
  SUCCESS: require('../assets/sounds/success.mp3'),
  FAILURE: require('../assets/sounds/failure.mp3'),
  TENSION_STINGER: require('../assets/sounds/tension.mp3'),
  ROULETTE: require('../assets/sounds/roulette.mp3'),
  HEARTBEAT: require('../assets/sounds/heartbeat.mp3'),
  CLICK: require('../assets/sounds/click.mp3'),
};

type SoundKey = keyof typeof SOUNDS;

class SoundService {
  private static instance: SoundService;
  private soundObjects: Map<string, Audio.Sound> = new Map();
  private backgroundMusic: Audio.Sound | null = null;
  private isAudioUnlocked = Platform.OS !== 'web';
  private pendingBackgroundMusic: SoundKey | null = null;

  private constructor() {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    
    if (Platform.OS === 'web') {
      this.setupWebInteractionListener();
    }
    
    console.log('[SoundService] Audio mode initialized');
  }

  private setupWebInteractionListener() {
    const unlock = () => {
      if (this.isAudioUnlocked) return;
      
      console.log('[SoundService] Web audio interaction detected, unlocking...');
      this.isAudioUnlocked = true;
      
      // Remove listeners
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('mousedown', unlock);

      // Play pending music if any
      if (this.pendingBackgroundMusic) {
        console.log(`[SoundService] Playing pending background music: ${this.pendingBackgroundMusic}`);
        this.playBackgroundMusic(this.pendingBackgroundMusic);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('click', unlock);
      window.addEventListener('touchstart', unlock);
      window.addEventListener('keydown', unlock);
      window.addEventListener('mousedown', unlock);
    }
  }

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  async playSFX(key: SoundKey) {
    const { soundEnabled, hapticsEnabled } = useSettingsStore.getState();

    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!soundEnabled) return;

    try {
      console.log(`[SoundService] Playing SFX: ${key}`);
      const { sound } = await Audio.Sound.createAsync(SOUNDS[key]);
      await sound.playAsync();
      console.log(`[SoundService] SFX ${key} started playing`);
      
      // Auto unload after play
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log(`[SoundService] SFX ${key} finished, unloading`);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error(`[SoundService] Error playing sound ${key}:`, error);
    }
  }

  async playBackgroundMusic(key: SoundKey) {
    const { musicEnabled } = useSettingsStore.getState();
    
    // Stop current music if any
    await this.stopBackgroundMusic();

    if (!musicEnabled) return;

    if (!this.isAudioUnlocked) {
      console.log(`[SoundService] Audio not yet unlocked, queueing background music: ${key}`);
      this.pendingBackgroundMusic = key;
      return;
    }

    try {
      console.log(`[SoundService] Loading Background Music: ${key} (MusicEnabled: ${musicEnabled})`);
      const { sound } = await Audio.Sound.createAsync(
        SOUNDS[key],
        { isLooping: true, volume: 0.5 }
      );
      this.backgroundMusic = sound;
      await sound.playAsync();
      this.pendingBackgroundMusic = null;
      console.log(`[SoundService] Background Music ${key} started`);
    } catch (error) {
      console.error(`[SoundService] Error playing background music ${key}:`, error);
    }
  }

  async stopBackgroundMusic() {
    if (this.backgroundMusic) {
      try {
        await this.backgroundMusic.stopAsync();
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
      } catch (error) {
        console.warn('Error stopping background music:', error);
      }
    }
  }

  async triggerHaptic(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) {
    const { hapticsEnabled } = useSettingsStore.getState();
    if (hapticsEnabled) {
      await Haptics.impactAsync(style);
    }
  }
}

export default SoundService.getInstance();
