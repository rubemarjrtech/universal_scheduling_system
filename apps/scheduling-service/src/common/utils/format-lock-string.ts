function formatLockStr(providerId: number, hour: string): string {
  return `lock:${providerId}:${hour}`;
}

export default formatLockStr;
