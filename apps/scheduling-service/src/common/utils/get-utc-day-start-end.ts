import { addDays, format, parseISO } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

function getUtcDayStartEnd(date: string) {
  const timezone = 'America/Sao_Paulo';
  const localDateStr = formatInTimeZone(date, timezone, 'yyyy-MM-dd');
  const localDateObj = parseISO(localDateStr);
  const startLocalString = `${localDateStr} 00:00:00`;
  const nextDayDate = addDays(localDateObj, 1);
  const nextDayString = format(nextDayDate, 'yyyy-MM-dd');
  const endLocalString = `${nextDayString} 00:00:00`;
  const startUtc = fromZonedTime(startLocalString, timezone);
  const endUtc = fromZonedTime(endLocalString, timezone);

  return {
    startUtc,
    endUtc,
  };
}

export default getUtcDayStartEnd;
