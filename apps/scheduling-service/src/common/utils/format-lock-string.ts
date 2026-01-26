import { ProviderLockSlotDto } from '@app/common';
import { formatInTimeZone } from 'date-fns-tz';

function formatLockKey(data: ProviderLockSlotDto): string {
  const timezone = 'America/Sao_Paulo';

  if (data.time) {
    const localDate = formatInTimeZone(data.date, timezone, 'yyyy-MM-dd');
    return `lock:${data.provider_id}:${localDate}T${data.time}:${data.customer_id}`;
  }

  const referenceDate = new Date(data.date);
  const localDate = formatInTimeZone(referenceDate, timezone, 'yyyy-MM-dd');
  const localTime = formatInTimeZone(referenceDate, timezone, 'HH:mm');
  return `lock:${data.provider_id}:${localDate}T${localTime}:${data.customer_id}`;
}

export default formatLockKey;
