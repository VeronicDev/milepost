/**
 * ICS (iCalendar) generation for programme deadlines.
 */

export interface DeadlineItem {
  key: string;
  label: string;
  unixSeconds: number | bigint;
}

/**
 * Escape special characters in text values for ICS format.
 * According to RFC 5545, comma, semicolon, and backslash must be escaped with a backslash,
 * and newlines are encoded as \n.
 */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Format a Unix timestamp (seconds) into an ICS UTC date-time string (YYYYMMDDTHHMMSSZ).
 */
export function formatIcsTimestamp(unixSeconds: number | bigint): string {
  const date = new Date(Number(unixSeconds) * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Generate an ICS string containing events for all deadlines that have not yet passed.
 */
export function generateIcs(programmeName: string, programmeUrl: string, deadlines: DeadlineItem[], now: Date = new Date()): string {
  const nowTimestamp = formatIcsTimestamp(Math.floor(now.getTime() / 1000));
  const unpassed = deadlines.filter((d) => Number(d.unixSeconds) * 1000 > now.getTime());

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Milepost//Programme Deadlines//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const d of unpassed) {
    const dt = formatIcsTimestamp(d.unixSeconds);
    const summary = escapeIcsText(`${d.label}: ${programmeName}`);
    const description = escapeIcsText(`Deadline for ${d.label} in programme ${programmeName}.\n\nView programme: ${programmeUrl}`);
    const uid = `deadline-${d.key}-${d.unixSeconds}@milepost`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowTimestamp}`,
      `DTSTART:${dt}`,
      `DTEND:${dt}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `URL:${programmeUrl}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
