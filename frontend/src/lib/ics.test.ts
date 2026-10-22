import { describe, it, expect } from 'vitest';
import { escapeIcsText, formatIcsTimestamp, generateIcs } from './ics';

describe('ICS generation', () => {
  it('escapes special characters correctly', () => {
    const raw = 'Hello, world; test\\backslash\nnew line';
    const escaped = escapeIcsText(raw);
    expect(escaped).toBe('Hello\, world\; test\\\\backslash\\nnew line');
  });

  it('formats timestamp to UTC ICS string', () => {
    // 2026-06-15T12:30:00Z -> 1781531400 seconds
    const ts = 1781531400;
    expect(formatIcsTimestamp(ts)).toBe('20260615T123000Z');
  });

  it('generates valid ICS containing only unpassed deadlines', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    const deadlines = [
      { key: 'apply', label: 'Applications close', unixSeconds: Math.floor(now.getTime() / 1000) - 1000 }, // past
      { key: 'review', label: 'Review closes', unixSeconds: Math.floor(now.getTime() / 1000) + 5000 }, // future
    ];

    const ics = generateIcs('Test Programme', 'https://milepost.local/programme?id=123', deadlines, now);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Review closes: Test Programme');
    expect(ics).not.toContain('Applications close');
    expect(ics).toContain('URL:https://milepost.local/programme?id=123');
    expect(ics).toContain('END:VCALENDAR');
  });
});
