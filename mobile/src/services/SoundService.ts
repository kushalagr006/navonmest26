import { Audio } from 'expo-av';
import { Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

let soundInstance: Audio.Sound | null = null;
let isAlarmActive = false;

// Initialize high-priority emergency alarm notification channel on Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('emergency-alarm', {
    name: 'Nex Guard Emergency Alarm',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'emergency_alarm.mp3',
    vibrationPattern: [0, 600, 300, 600, 300],
    enableLights: true,
    lightColor: '#DC2626',
    bypassDnd: true,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  }).catch(() => undefined);
}

export const SoundService = {
  /**
   * Play the emergency alarm MP3 through the device speakers at max volume.
   */
  async playEmergencyAlarm(): Promise<void> {
    if (isAlarmActive) return;
    isAlarmActive = true;

    // 1. Continuous physical emergency vibration
    try {
      Vibration.vibrate([0, 600, 300, 600, 300], true);
    } catch (e) {
      console.warn('[SOUND SERVICE] Vibration error:', e);
    }

    // 2. Play the actual emergency alarm MP3 via Expo AV
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      if (soundInstance) {
        try {
          await soundInstance.stopAsync();
          await soundInstance.unloadAsync();
        } catch {}
        soundInstance = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/emergency_alarm.mp3'),
        {
          shouldPlay: true,
          isLooping: true,
          volume: 1.0,
        }
      );

      soundInstance = sound;
      await sound.playAsync();
    } catch (error) {
      console.warn('[SOUND SERVICE] Audio playback error:', error);
    }
  },

  /**
   * Stop the emergency alarm sound and vibration.
   */
  async stopEmergencyAlarm(): Promise<void> {
    isAlarmActive = false;

    // Stop vibration
    try {
      Vibration.cancel();
    } catch {}

    // Stop and unload sound
    if (soundInstance) {
      try {
        await soundInstance.stopAsync();
        await soundInstance.unloadAsync();
      } catch (error) {
        console.warn('[SOUND SERVICE] Error stopping audio:', error);
      } finally {
        soundInstance = null;
      }
    }
  },

  isPlaying(): boolean {
    return isAlarmActive;
  },
};
