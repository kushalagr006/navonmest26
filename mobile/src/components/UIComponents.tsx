/**
 * Nex Guard Premium Product Component Primitives
 * Minimalist, whitespace-driven, typography-focused, human-centric.
 */
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

// 1. SCREEN CONTAINER
export function Screen({
  children,
  scrollable = true,
  style,
  activeTab,
  onTabChange,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  activeTab?: 'HOME' | 'ALERTS' | 'DEVICE' | 'PROFILE';
  onTabChange?: (tab: 'HOME' | 'ALERTS' | 'DEVICE' | 'PROFILE') => void;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, style]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fixedContent, style]}>{children}</View>
        )}
      </View>
      {activeTab && onTabChange && <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />}
    </SafeAreaView>
  );
}

// HEADER
export function Header({
  title,
  subtitle,
  onBack,
  rightAction,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
        {rightAction}
      </View>
    </View>
  );
}

// 2. BOTTOM NAVIGATION BAR
export function BottomNavBar({
  activeTab,
  onTabChange,
}: {
  activeTab: 'HOME' | 'ALERTS' | 'DEVICE' | 'PROFILE';
  onTabChange: (tab: 'HOME' | 'ALERTS' | 'DEVICE' | 'PROFILE') => void;
}) {
  const tabs: { key: 'HOME' | 'ALERTS' | 'DEVICE' | 'PROFILE'; label: string; icon: string }[] = [
    { key: 'HOME', label: 'Home', icon: '●' },
    { key: 'ALERTS', label: 'Alerts', icon: '≡' },
    { key: 'DEVICE', label: 'Device', icon: '▢' },
    { key: 'PROFILE', label: 'Profile', icon: '○' },
  ];

  return (
    <View style={styles.navBarContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.navTab}
            onPress={() => onTabChange(tab.key)}
            hitSlop={8}
          >
            <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// 3. LARGE SAFE STATUS (Apple Health / Oura / WHOOP Style)
export function LargeSafeStatus({
  recipientName,
  lastCheckText = 'Just now',
}: {
  recipientName: string;
  lastCheckText?: string;
}) {
  return (
    <View style={styles.safeStatusBox}>
      <View style={styles.safeStatusHeader}>
        <View style={styles.safeDot} />
        <Text style={styles.safeTag}>SAFE</Text>
      </View>
      <Text style={styles.safeMainTitle}>Everything looks good</Text>
      <Text style={styles.safeMeta}>
        Watching over {recipientName} · Monitoring active · {lastCheckText}
      </Text>
    </View>
  );
}

// 4. LIGHTWEIGHT TIMELINE ITEM (Minimal Linear Activity)
export function TimelineItem({
  title,
  time,
  status = 'safe',
}: {
  title: string;
  time: string;
  status?: 'safe' | 'warning' | 'emergency' | 'neutral';
}) {
  const iconSymbol = status === 'safe' ? '✓' : status === 'warning' ? '!' : status === 'emergency' ? '🚨' : '•';
  const iconColor =
    status === 'safe'
      ? theme.colors.safe
      : status === 'warning'
      ? theme.colors.warning
      : status === 'emergency'
      ? theme.colors.emergency
      : theme.colors.textMuted;

  return (
    <View style={styles.timelineItem}>
      <Text style={[styles.timelineIcon, { color: iconColor }]}>{iconSymbol}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

// 5. COMPACT DEVICE STATUS
export function CompactDeviceStatus({
  deviceId = 'NEX GUARD 001',
  mode = 'Simulation Mode',
}: {
  deviceId?: string;
  mode?: string;
}) {
  return (
    <View style={styles.compactDeviceCard}>
      <View style={styles.compactDeviceHeader}>
        <Text style={styles.compactDeviceName}>{deviceId}</Text>
        <Text style={styles.compactDeviceMode}>{mode}</Text>
      </View>
      <View style={styles.compactGrid}>
        <View style={styles.compactCell}>
          <Text style={styles.compactCellLabel}>Sensors</Text>
          <Text style={styles.compactCellValue}>Simulated</Text>
        </View>
        <View style={styles.compactCell}>
          <Text style={styles.compactCellLabel}>GPS</Text>
          <Text style={styles.compactCellValue}>Phone GPS</Text>
        </View>
        <View style={styles.compactCell}>
          <Text style={styles.compactCellLabel}>Battery</Text>
          <Text style={styles.compactCellValue}>Unavailable</Text>
        </View>
      </View>
    </View>
  );
}

// 6. BUTTONS
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const buttonStyle = [
    styles.btn,
    variant === 'primary' && styles.btnPrimary,
    variant === 'secondary' && styles.btnSecondary,
    variant === 'danger' && styles.btnDanger,
    variant === 'ghost' && styles.btnGhost,
    (disabled || loading) && styles.btnDisabled,
    style,
  ];

  const textStyle = [
    styles.btnText,
    variant === 'primary' && styles.btnTextPrimary,
    variant === 'secondary' && styles.btnTextSecondary,
    variant === 'danger' && styles.btnTextDanger,
    variant === 'ghost' && styles.btnTextGhost,
  ];

  return (
    <Pressable style={buttonStyle} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? theme.colors.textInverse : theme.colors.primary} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </Pressable>
  );
}

// 7. INPUT FIELD
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string | null;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isSecure = secureTextEntry && !showPassword;

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSubtle}
          secureTextEntry={isSecure}
          style={styles.textInput}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeToggle}>
            <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// 8. DIAGNOSTIC ROW
export function DiagnosticRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.diagRow}>
      <Text style={styles.diagLabel}>{label}</Text>
      <Text style={styles.diagValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  fixedContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  navBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  navIcon: {
    fontSize: 16,
    color: theme.colors.textSubtle,
  },
  navIconActive: {
    color: theme.colors.primary,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  navLabelActive: {
    color: theme.colors.primary,
  },
  safeStatusBox: {
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    marginBottom: theme.spacing.xl,
  },
  safeStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  safeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.safeVibrant,
  },
  safeTag: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.safe,
  },
  safeMainTitle: {
    ...theme.typography.displayHero,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  safeMeta: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  timelineIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  timelineTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  timelineTime: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  compactDeviceCard: {
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    marginBottom: theme.spacing.lg,
  },
  compactDeviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
  },
  compactDeviceName: {
    ...theme.typography.titleMedium,
    color: theme.colors.textPrimary,
  },
  compactDeviceMode: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  compactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactCell: {
    flex: 1,
  },
  compactCellLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSubtle,
  },
  compactCellValue: {
    ...theme.typography.bodyMedium,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  btn: {
    height: 52,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  btnSecondary: {
    backgroundColor: theme.colors.surfaceSubtle,
  },
  btnDanger: {
    backgroundColor: theme.colors.emergency,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    ...theme.typography.button,
  },
  btnTextPrimary: {
    color: theme.colors.textInverse,
  },
  btnTextSecondary: {
    color: theme.colors.textPrimary,
  },
  btnTextDanger: {
    color: theme.colors.textInverse,
  },
  btnTextGhost: {
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...theme.typography.labelMedium,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },
  inputErrorBorder: {
    borderColor: theme.colors.emergency,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  eyeToggle: {
    padding: theme.spacing.xs,
  },
  eyeText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.emergency,
    marginTop: 4,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  diagLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  diagValue: {
    ...theme.typography.bodyMedium,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  headerContainer: {
    marginBottom: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  backButton: {
    paddingRight: theme.spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  headerTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
