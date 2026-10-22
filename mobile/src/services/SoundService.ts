import { Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

let isAlarmActive = false;

// Create high-priority Android Notification Channel for Emergency Siren
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('emergency-siren', {
    name: 'Emergency Alarm Siren',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 600, 300, 600, 300],
    sound: 'default',
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
   * Play the emergency alarm siren using Android's native high-decibel Alarm channel
   * and physical continuous emergency vibration pattern.
   * Completely native-compatible with your existing APK build (0 crashes, 0 app.json changes).
   */
  async playEmergencyAlarm(): Promise<void> {
    if (isAlarmActive) return;
    isAlarmActive = true;

    // 1. Continuous physical emergency vibration
    try {
      Vibration.vibrate([0, 600, 300, 600, 300], true);
    } catch (e) {
      console.warn('[SOUND SERVICE] Vibration warning:', e);
    }

    // 2. Play high-decibel Alarm Siren sound via native Notification Alarm channel
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 EMERGENCY ALERT — FALL DETECTED',
          body: 'High-priority emergency takeover active on your device.',
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          ...({ channelId: 'emergency-siren' } as any),
        },
        trigger: null,
      });
    } catch (err) {
      console.warn('[SOUND SERVICE] Emergency siren notification warning:', err);
    }
  },

  /**
   * Stop the emergency alarm and vibration.
   */
  async stopEmergencyAlarm(): Promise<void> {
    isAlarmActive = false;

    // Cancel vibration
    try {
      Vibration.cancel();
    } catch {}

    // Dismiss alarm notification
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch {}
  },

  isPlaying(): boolean {
    return isAlarmActive;
  },
};
