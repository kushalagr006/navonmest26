/**
 * Nex Guard Product Redesign — Apple Health / Oura / Linear / WHOOP Inspired
 * Minimalist, typography-driven, zero AI-generated clutter, clean space utilization.
 */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from './theme';
import { EventPayload, RootStackParamList } from './types';
import { useAlertStore, useAuthStore, useDeviceStore } from './store';

import { AuthService } from './services/AuthService';
import { ProfileService } from './services/ProfileService';
import { DeviceService } from './services/DeviceService';
import { AlertService } from './services/AlertService';
import { FallDetectionService, FallStateMachineState } from './services/FallDetectionService';

import {
  Button,
  CompactDeviceStatus,
  DiagnosticRow,
  Header,
  Input,
  LargeSafeStatus,
  Screen,
  TimelineItem,
} from './components/UIComponents';

type Props<Route extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Route>;

// 1. LOGIN SCREEN
export function LoginScreen({ navigation }: Props<'Login'>) {
  const [email, setEmail] = useState('caregiver@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.login({ email, password });
      setAuth(res.user.id, res.user.email, res.user.full_name);
    } catch (e: any) {
      setError(e.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.authContainer}>
        <View style={styles.authHeader}>
          <Text style={styles.authBrand}>NEX GUARD</Text>
          <Text style={styles.authTitle}>Caregiver Access</Text>
          <Text style={styles.authSubtitle}>Personal safety & emergency monitoring</Text>
        </View>

        <View style={styles.formSpace}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="caregiver@example.com"
            error={error}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />

          <Button label="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: theme.spacing.md }} />
          <Button
            label="Create New Account"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: theme.spacing.sm }}
          />
        </View>

        <Text style={styles.authFooter}>Standalone Local Account · Data stays on your device</Text>
      </View>
    </Screen>
  );
}

// 2. REGISTER SCREEN
export function RegisterScreen({ navigation }: Props<'Register'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.register({ email, password, full_name: name });
      setAuth(res.user.id, res.user.email, res.user.full_name);
    } catch (e: any) {
      setError(e.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="Create Account" subtitle="Set up your caregiver console" onBack={() => navigation.goBack()} />

      <View style={styles.formSpace}>
        <Input
          label="Your Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Anshuman"
          error={error}
        />
        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Minimum 6 characters"
          secureTextEntry
        />

        <Button label="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: theme.spacing.md }} />
      </View>
    </Screen>
  );
}

// 3. ONBOARDING SCREEN
export function OnboardingScreen() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = useAuthStore((state) => state.userId);
  const completeProfile = useAuthStore((state) => state.completeProfile);

  const handleSave = async () => {
    const elderlyName = name.trim() || 'Buddha 2';
    setLoading(true);
    try {
      await ProfileService.createProfile({
        userId,
        full_name: elderlyName,
        medical_notes: relationship,
      });
    } catch (e) {
      console.warn('[LOCAL PROFILE ERROR]', e);
    } finally {
      setLoading(false);
      completeProfile(elderlyName, relationship);
    }
  };

  return (
    <Screen>
      <Header title="Care Recipient" subtitle="Who are you watching over?" />

      <View style={styles.formSpace}>
        <Input
          label="Recipient Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Buddha 2"
        />
        <Input
          label="Relationship / Notes"
          value={relationship}
          onChangeText={setRelationship}
          placeholder="e.g. Parent"
        />

        <Button label="Save Care Plan" onPress={handleSave} loading={loading} style={{ marginTop: theme.spacing.md }} />
      </View>
    </Screen>
  );
}

// 4. DEVICE SETUP SCREEN
export function DeviceSetupScreen() {
  const [deviceId, setDeviceId] = useState('nex-guard-001');
  const [loading, setLoading] = useState(false);
  const configure = useDeviceStore((state) => state.configure);

  const handlePair = async () => {
    const id = deviceId.trim() || 'nex-guard-001';
    setLoading(true);
    try {
      await DeviceService.registerDevice(id);
    } catch (e) {
      console.warn('[LOCAL DEVICE REGISTRATION ERROR]', e);
    } finally {
      setLoading(false);
      configure(id);
    }
  };

  return (
    <Screen>
      <Header title="Connect Device" subtitle="Set up wearable monitoring" />

      <View style={styles.formSpace}>
        <Input
          label="Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
          placeholder="nex-guard-001"
        />

        <DiagnosticRow label="Model" value="ESP32-S3 Wearable" />
        <DiagnosticRow label="Operational Mode" value="Standalone Local Mode" />

        <Button label="Complete Setup" onPress={handlePair} loading={loading} style={{ marginTop: theme.spacing.xl }} />
      </View>
    </Screen>
  );
}

// 5. DASHBOARD SCREEN (CAREGIVER COMMAND CENTER)
export function DashboardScreen({ navigation }: Props<'Dashboard'>) {
  const caregiverName = useAuthStore((state) => state.caregiverName);
  const elderlyName = useAuthStore((state) => state.elderlyName);
  const battery = useDeviceStore((state) => state.batteryLevel);
  const history = useAlertStore((state) => state.history);
  const deviceId = useDeviceStore((state) => state.deviceId);

  const [loading, setLoading] = useState(false);

  const loadLocalAlerts = async () => {
    setLoading(true);
    try {
      const alerts = await AlertService.getAlertHistory();
      const events: EventPayload[] = alerts.map((a) => ({
        id: a.id,
        device_id: a.fall_event?.device_id || deviceId || 'nex-guard-001',
        event_type: (a.fall_event?.event_type as 'FALL_DETECTED' | 'POTENTIAL_FALL' | 'CANCELLED') || 'FALL_DETECTED',
        occurred_at: a.fall_event?.occurred_at || a.created_at,
        confidence: a.fall_event?.confidence || 0.95,
        latitude: a.fall_event?.latitude ?? null,
        longitude: a.fall_event?.longitude ?? null,
        battery_level: battery ?? 81,
        alert_id: a.id,
      }));
      useAlertStore.getState().setHistory(events);
    } catch (e) {
      console.warn('[DASHBOARD LOCAL ALERTS ERROR]', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLocalAlerts();
  }, []);

  const recipientDisplayName = elderlyName || 'Buddha 2';

  return (
    <Screen
      activeTab="HOME"
      onTabChange={(tab) => {
        if (tab === 'ALERTS') navigation.navigate('History');
        if (tab === 'DEVICE') navigation.navigate('DeviceHealth');
        if (tab === 'PROFILE') navigation.navigate('Profile');
      }}
    >
      {/* HEADER & CONTEXT */}
      <View style={styles.topBar}>
        <Text style={theme.typography.eyebrow}>NEX GUARD / LOCAL MODE</Text>
        <Text style={styles.greetingText}>Good morning, {caregiverName || 'Anshuman'}</Text>
      </View>

      {/* LARGE SAFE STATUS (Typography + Whitespace Driven) */}
      <LargeSafeStatus recipientName={recipientDisplayName} lastCheckText="Just now" />

      {/* RECENT ACTIVITY TIMELINE */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleText}>Recent Activity</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: theme.spacing.md }} />
      ) : (
        <View style={styles.timelineBox}>
          <TimelineItem title="Monitoring active" time="Just now" status="safe" />
          <TimelineItem title={`Device registered (${deviceId || 'NEX GUARD 001'})`} time="Today" status="safe" />
          {history.slice(0, 3).map((item) => (
            <TimelineItem
              key={item.id}
              title={item.event_type === 'FALL_DETECTED' ? 'Fall detected' : 'System check'}
              time={new Date(item.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              status={item.event_type === 'FALL_DETECTED' ? 'warning' : 'safe'}
            />
          ))}
        </View>
      )}

      {/* COMPACT DEVICE STATUS */}
      <CompactDeviceStatus deviceId={deviceId || 'NEX GUARD 001'} mode="Simulation Mode" />
    </Screen>
  );
}

// 6. EMERGENCY SCREEN (HIGH-PRIORITY TAKEOVER DESIGN)
export function EmergencyScreen({ navigation }: Props<'Emergency'>) {
  const event = useAlertStore((state) => state.currentAlert);
  const activeAlertId = useAlertStore((state) => state.activeAlertId);
  const alertStatus = useAlertStore((state) => state.alertStatus);

  const updateAlertStatus = useAlertStore((state) => state.updateAlertStatus);
  const clearCurrent = useAlertStore((state) => state.clearCurrent);

  const [engineState, setEngineState] = useState<FallStateMachineState>(FallDetectionService.getCurrentState());
  const [countdown, setCountdown] = useState<number>(FallDetectionService.getCountdown());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      if (mounted) {
        setEngineState(FallDetectionService.getCurrentState());
        setCountdown(FallDetectionService.getCountdown());
      }
    }, 500);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCancelFall = async () => {
    setLoading(true);
    await FallDetectionService.cancelFall();
    setLoading(false);
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleConfirmEmergency = async () => {
    setLoading(true);
    const alert = await FallDetectionService.confirmFall();
    if (alert && alert.fall_event) {
      const payload: EventPayload = {
        id: alert.id,
        device_id: alert.fall_event.device_id,
        event_type: (alert.fall_event.event_type as any) || 'FALL_DETECTED',
        occurred_at: alert.fall_event.occurred_at,
        confidence: alert.fall_event.confidence,
        latitude: alert.fall_event.latitude ?? null,
        longitude: alert.fall_event.longitude ?? null,
        battery_level: 81,
        alert_id: alert.id,
      };
      useAlertStore.getState().receiveAlert(payload);
    }
    setLoading(false);
  };

  const handleAcknowledge = async () => {
    setLoading(true);
    if (activeAlertId) {
      try {
        await AlertService.acknowledgeAlert(activeAlertId, 'Acknowledged via local mobile console');
      } catch (e) {
        console.warn('[LOCAL ACKNOWLEDGE ERROR]', e);
      }
    }
    updateAlertStatus(activeAlertId || 'local', 'ACKNOWLEDGED');
    setLoading(false);
  };

  const handleResolve = async () => {
    setLoading(true);
    if (activeAlertId) {
      try {
        await AlertService.resolveAlert(activeAlertId, 'Resolved via local mobile console');
      } catch (e) {
        console.warn('[LOCAL RESOLVE ERROR]', e);
      }
    }
    updateAlertStatus(activeAlertId || 'local', 'RESOLVED');
    clearCurrent();
    setLoading(false);
    if (navigation.canGoBack()) navigation.goBack();
  };

  const isConfirmationWindow = engineState === 'USER_CONFIRMATION' || engineState === 'POSSIBLE_FALL';

  return (
    <Screen style={styles.emergencyContainer}>
      <Text style={theme.typography.eyebrow}>NEX GUARD / PRIORITY TAKEOVER</Text>

      {isConfirmationWindow ? (
        <View style={styles.emergencyTakeoverContent}>
          <Text style={styles.emergencyMainHeader}>POSSIBLE FALL</Text>
          <Text style={styles.emergencySubHeader}>Are you okay?</Text>

          <View style={styles.timerCircle}>
            <Text style={styles.timerBigNumber}>{countdown}</Text>
            <Text style={styles.timerLabel}>seconds</Text>
          </View>

          <View style={styles.emergencyActionBox}>
            <Button label="I'M OK" variant="primary" onPress={handleCancelFall} loading={loading} style={{ height: 56 }} />
            <Button label="CONFIRM EMERGENCY" variant="danger" onPress={handleConfirmEmergency} loading={loading} style={{ height: 56 }} />
          </View>
        </View>
      ) : (
        <View style={styles.emergencyTakeoverContent}>
          <Text style={[styles.emergencyMainHeader, { color: theme.colors.emergency }]}>FALL CONFIRMED</Text>
          <Text style={styles.emergencySubHeader}>Emergency alert active</Text>

          <View style={styles.diagBlock}>
            <DiagnosticRow label="Time" value={event ? new Date(event.occurred_at).toLocaleTimeString() : 'Just now'} />
            <DiagnosticRow
              label="Location"
              value={
                event?.latitude !== undefined && event?.latitude !== null
                  ? `${event.latitude}, ${event.longitude}`
                  : 'Phone GPS Available'
              }
            />
            <DiagnosticRow label="Status" value={alertStatus || 'ACTIVE'} />
          </View>

          {alertStatus !== 'RESOLVED' && (
            <View style={styles.emergencyActionBox}>
              {alertStatus !== 'ACKNOWLEDGED' && (
                <Button label="ACKNOWLEDGE" variant="primary" onPress={handleAcknowledge} loading={loading} style={{ height: 56 }} />
              )}
              <Button label="RESOLVE" variant="secondary" onPress={handleResolve} loading={loading} style={{ height: 56 }} />
            </View>
          )}
        </View>
      )}
    </Screen>
  );
}

// 7. HISTORY SCREEN (TIMELINE FORMAT)
export function HistoryScreen({ navigation }: Props<'History'>) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchHistory() {
      try {
        const localAlerts = await AlertService.getAlertHistory();
        if (mounted) setAlerts(localAlerts);
      } catch (e) {
        console.warn('[HISTORY LOAD ERROR]', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void fetchHistory();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen
      activeTab="ALERTS"
      onTabChange={(tab) => {
        if (tab === 'HOME') navigation.navigate('Dashboard');
        if (tab === 'DEVICE') navigation.navigate('DeviceHealth');
        if (tab === 'PROFILE') navigation.navigate('Profile');
      }}
    >
      <Header title="Alert History" subtitle="Incident timeline" />

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: theme.spacing.xl }} />
      ) : alerts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No incidents recorded</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.dateGroupHeader}>TODAY</Text>
          {alerts.map((item) => (
            <TimelineItem
              key={item.id}
              title={item.fall_event?.event_type === 'FALL_DETECTED' ? 'Fall confirmed' : 'Possible fall'}
              time={`${new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${item.status}`}
              status={item.status === 'RESOLVED' ? 'safe' : item.status === 'ACKNOWLEDGED' ? 'warning' : 'emergency'}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

// 8. DEVICE HEALTH SCREEN (DIAGNOSTICS FORMAT)
export function DeviceHealthScreen({ navigation }: Props<'DeviceHealth'>) {
  const deviceId = useDeviceStore((state) => state.deviceId);

  return (
    <Screen
      activeTab="DEVICE"
      onTabChange={(tab) => {
        if (tab === 'HOME') navigation.navigate('Dashboard');
        if (tab === 'ALERTS') navigation.navigate('History');
        if (tab === 'PROFILE') navigation.navigate('Profile');
      }}
    >
      <Header title={deviceId || 'NEX GUARD 001'} subtitle="● Simulation mode" />

      <Text style={styles.dateGroupHeader}>SENSORS</Text>
      <DiagnosticRow label="Motion" value="Simulated" />
      <DiagnosticRow label="Pressure" value="Simulated" />
      <DiagnosticRow label="GPS" value="Phone GPS" />
      <DiagnosticRow label="Battery" value="Unavailable" />

      <Text style={[styles.dateGroupHeader, { marginTop: theme.spacing.xl }]}>CONNECTION</Text>
      <DiagnosticRow label="ESP32" value="Not connected" />
      <DiagnosticRow label="Backend" value="Local only" />
    </Screen>
  );
}

// 9. PROFILE SCREEN (MINIMAL SETTINGS)
export function ProfileScreen({ navigation }: Props<'Profile'>) {
  const caregiverName = useAuthStore((state) => state.caregiverName);
  const elderlyName = useAuthStore((state) => state.elderlyName);
  const email = useAuthStore((state) => state.email);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <Screen
      activeTab="PROFILE"
      onTabChange={(tab) => {
        if (tab === 'HOME') navigation.navigate('Dashboard');
        if (tab === 'ALERTS') navigation.navigate('History');
        if (tab === 'DEVICE') navigation.navigate('DeviceHealth');
      }}
    >
      <Header title="Profile & Settings" subtitle="Caregiver preferences" />

      <DiagnosticRow label="Caregiver" value={caregiverName || 'Anshuman'} />
      <DiagnosticRow label="Email" value={email || 'local.user@device'} />
      <DiagnosticRow label="Care Recipient" value={elderlyName || 'Buddha 2'} />
      <DiagnosticRow label="Storage" value="SQLite + SecureStore" />
      <DiagnosticRow label="Mode" value="Standalone Local Mode" />

      <Button
        label="Open Scenario Lab"
        variant="secondary"
        onPress={() => navigation.navigate('ScenarioCenter')}
        style={{ marginTop: theme.spacing.xl }}
      />
      <Button label="Sign Out" variant="ghost" onPress={signOut} style={{ marginTop: theme.spacing.sm }} />
    </Screen>
  );
}

// 10. SCENARIO CENTER (SCENARIO LAB)
export function ScenarioCenterScreen({ navigation }: Props<'ScenarioCenter'>) {
  const [resultText, setResultText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const deviceId = useDeviceStore((state) => state.deviceId);

  const runTestScenario = async (scenario: any) => {
    setLoading(true);
    setResultText(null);
    try {
      const res = await FallDetectionService.triggerScenario(scenario, deviceId || 'nex-guard-001');
      setResultText(res.label);
      if (res.isFall) {
        navigation.navigate('Emergency');
      }
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="SCENARIO LAB" subtitle="Test Nex Guard without physical hardware" onBack={() => navigation.goBack()} />

      {resultText && (
        <View style={styles.diagBlock}>
          <Text style={styles.dateGroupHeader}>SIMULATION OUTPUT</Text>
          <Text style={styles.simResultText}>{resultText}</Text>
        </View>
      )}

      <Text style={styles.dateGroupHeader}>NORMAL ACTIVITY</Text>
      <DiagnosticRow label="Simulate Walking (1.15g)" value="Run" />
      <Button label="Run Walking Test" variant="secondary" onPress={() => runTestScenario('NORMAL_WALKING')} loading={loading} style={{ marginVertical: 6 }} />

      <DiagnosticRow label="Simulate Sitting (1.02g)" value="Run" />
      <Button label="Run Sitting Test" variant="secondary" onPress={() => runTestScenario('SITTING')} loading={loading} style={{ marginVertical: 6 }} />

      <Text style={[styles.dateGroupHeader, { marginTop: theme.spacing.xl }]}>FALL EVENTS</Text>
      <Button label="Run Impact Fall Test (3.80g)" variant="primary" onPress={() => runTestScenario('SUDDEN_IMPACT_FALL')} loading={loading} style={{ marginVertical: 6 }} />
      <Button label="Run Walk → Fall Test (3.10g)" variant="primary" onPress={() => runTestScenario('WALK_FALL')} loading={loading} style={{ marginVertical: 6 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  authHeader: {
    marginBottom: theme.spacing.xl,
  },
  authBrand: {
    ...theme.typography.eyebrow,
    marginBottom: 4,
  },
  authTitle: {
    ...theme.typography.displayStatus,
    color: theme.colors.textPrimary,
  },
  authSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  formSpace: {
    marginVertical: theme.spacing.lg,
  },
  authFooter: {
    ...theme.typography.caption,
    color: theme.colors.textSubtle,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  topBar: {
    marginBottom: theme.spacing.md,
  },
  greetingText: {
    ...theme.typography.titleLarge,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sectionTitleText: {
    ...theme.typography.titleMedium,
    color: theme.colors.textPrimary,
  },
  timelineBox: {
    marginBottom: theme.spacing.lg,
  },
  emergencyContainer: {
    justifyContent: 'center',
  },
  emergencyTakeoverContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emergencyMainHeader: {
    ...theme.typography.displayHero,
    color: theme.colors.primary,
  },
  emergencySubHeader: {
    ...theme.typography.titleLarge,
    color: theme.colors.textMuted,
    marginTop: 4,
    marginBottom: theme.spacing.xl,
  },
  timerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  timerBigNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: theme.colors.primary,
    lineHeight: 76,
  },
  timerLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  emergencyActionBox: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  diagBlock: {
    marginVertical: theme.spacing.lg,
  },
  emptyBox: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  dateGroupHeader: {
    ...theme.typography.eyebrow,
    marginBottom: theme.spacing.sm,
  },
  simResultText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing.sm,
  },
});
