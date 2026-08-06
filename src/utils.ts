export function formatTableSize(formattedSize: string, sizeBytes?: number): string {
  if (!formattedSize) {
    if (sizeBytes !== undefined) {
      const kb = Math.round(sizeBytes / 1024);
      if (kb >= 1000) {
        const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
        return `${mb} Mb`;
      }
      return `${kb} kB`;
    }
    return '0 kB';
  }

  // Check if formattedSize has 4 or more digits in kB (e.g. "7144 kB")
  const kbMatch = formattedSize.match(/^(\d{4,})\s*kB$/i);
  if (kbMatch) {
    const kbNum = parseInt(kbMatch[1], 10);
    if (sizeBytes) {
      const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
      return `${mb} Mb`;
    }
    const mb = (kbNum / 1024).toFixed(1);
    return `${mb} Mb`;
  }

  return formattedSize;
}

export function formatGrowthMb(mb: number): string {
  const abs = Math.abs(mb);
  if (abs < 0.05) return '0 MB';
  if (abs < 10) return `${(mb > 0 ? '+' : '-') + abs.toFixed(1)} MB`;
  return `${(mb > 0 ? '+' : '-') + Math.round(abs)} MB`;
}

export function formatCountdown(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  return `${seconds}s`;
}
