import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

function dataUrlToBase64(dataUrl: string): string {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : dataUrl;
}

export async function sharePngCard(
  dataUrl: string,
  fileName: string,
  title: string
): Promise<'shared' | 'downloaded' | 'unsupported'> {
  if (!dataUrl) return 'unsupported';

  if (Capacitor.isNativePlatform()) {
    const base64Data = dataUrlToBase64(dataUrl);

    const saved = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache,
    });

    await Share.share({
      title,
      files: [saved.uri],
      dialogTitle: title,
    });

    return 'shared';
  }

  // Web fallback
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], fileName, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title,
      });
      return 'shared';
    }
  } catch {
    // Fall through to browser download
  }

  return downloadPngCardWeb(dataUrl, fileName);
}

export async function downloadPngCard(
  dataUrl: string,
  fileName: string
): Promise<'downloaded' | 'unsupported'> {
  if (!dataUrl) return 'unsupported';

  if (Capacitor.isNativePlatform()) {
    const base64Data = dataUrlToBase64(dataUrl);

    // Saves to the device's Documents folder (without requiring complex permissions for Cache)
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
    });

    return 'downloaded';
  }

  return downloadPngCardWeb(dataUrl, fileName);
}

function downloadPngCardWeb(
  dataUrl: string,
  fileName: string
): 'downloaded' | 'unsupported' {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return 'downloaded';
  } catch {
    return 'unsupported';
  }
}