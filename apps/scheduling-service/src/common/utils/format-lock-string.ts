import { ProviderLockSlotDto } from '@app/common';
import { formatInTimeZone } from 'date-fns-tz';

function formatLockStr(data: ProviderLockSlotDto): string {
  if (typeof data.date === 'object' && data.hour) {
    const localDate = formatInTimeZone(
      data.date,
      'America/Sao_Paulo',
      'yyyy-MM-dd',
    );
    return `lock:${data.provider_id}:${localDate}T${data.hour}:${data.customer_id}`;
  }

  const referenceDate = new Date(data.date);
  const localDate = formatInTimeZone(
    referenceDate,
    'America/Sao_Paulo',
    'yyyy-MM-dd',
  );
  const localTime = formatInTimeZone(
    referenceDate,
    'America/Sao_Paulo',
    'HH:mm',
  );
  return `lock:${data.provider_id}:${localDate}T${localTime}:${data.customer_id}`;
}

export default formatLockStr;
