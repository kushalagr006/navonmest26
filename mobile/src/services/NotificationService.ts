import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set foreground notification presentation options
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  /**
   * Request push notification permissions.
   */
  async registerForNotifications(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch (e) {
      console.warn('[NOTIFICATION SERVICE] Permission error:', e);
      return false;
    }
  },

  /**
   * Get Expo Push Token for receiving cloud notifications.
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.registerForNotifications();
      if (!hasPermission) {
        console.warn('[NOTIFICATION SERVICE] Permission not granted for push notifications.');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '195804ad-e282-4b19-bc24-bfd47000c0f1',
      });
      console.log('[NOTIFICATION SERVICE] Expo Push Token acquired:', tokenData.data);
      return tokenData.data;
    } catch (e) {
      console.warn('[NOTIFICATION SERVICE] Failed to get Expo push token:', e);
      return null;
    }
  },

  /**
   * Register interactive action buttons for the notification card.
   */
  async setupNotificationCategories(): Promise<void> {
    try {
      // Register buttons: "Open Google Maps" and "Acknowledge"
      await Notifications.setNotificationCategoryAsync('emergency-actions', [
        {
          identifier: 'OPEN_MAPS',
          buttonTitle: 'Open Google Maps',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'ACKNOWLEDGE',
          buttonTitle: 'Acknowledge',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      // Set up high-priority Android channel with custom sound
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('emergency-alarm', {
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
        });
      }
    } catch (e) {
      console.warn('[NOTIFICATION SERVICE] Category setup error:', e);
    }
  },

  /**
   * Send local emergency notification with interactive buttons and alarm sound.
   */
  async sendEmergencyNotification(title: string, body: string, data?: Record<string, any>): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'emergency_alarm.mp3',
          priority: Notifications.AndroidNotificationPriority.MAX,
          categoryIdentifier: 'emergency-actions',
          data: data || {},
          ...({ channelId: 'emergency-alarm' } as any),
        },
        trigger: null, // send immediately
      });
    } catch (e) {
      console.warn('[NOTIFICATION SERVICE] Notification failed:', e);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.dismissAllNotificationsAsync();
    } catch (e) {
      console.warn('[NOTIFICATION SERVICE] Cancel notifications failed:', e);
    }
  },
};
