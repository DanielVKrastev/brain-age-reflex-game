import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function triggerLightTap(): Promise<void> {
  if (!isNativeAndroid()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Ignore unsupported hardware errors
  }
}

export async function triggerErrorFeedback(): Promise<void> {
  if (!isNativeAndroid()) return;
  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch {
    // Ignore unsupported hardware errors
  }
}

export async function triggerSuccessFeedback(): Promise<void> {
  if (!isNativeAndroid()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Ignore unsupported hardware errors
  }
}