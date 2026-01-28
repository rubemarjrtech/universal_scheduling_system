import { ProviderLockSlotDto } from '@app/common';
import { formatInTimeZone } from 'date-fns-tz';

function formatLockKey(
  data: Pick<ProviderLockSlotDto, 'provider_id' | 'date' | 'time'>,
): string {
  const timezone = 'America/Sao_Paulo';

  if (data.time) {
    const localDate = formatInTimeZone(data.date, timezone, 'yyyy-MM-dd');
    return `lock:${data.provider_id}:${localDate}T${data.time}`;
  }

  const localDate = formatInTimeZone(data.date, timezone, 'yyyy-MM-dd');
  const localTime = formatInTimeZone(data.date, timezone, 'HH:mm');
  return `lock:${data.provider_id}:${localDate}T${localTime}`;
}

export default formatLockKey;
