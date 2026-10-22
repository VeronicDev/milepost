import React from 'react';
import { generateIcs, DeadlineItem } from '../../lib/ics';
import '../../styles/tokens.css';

export interface AddToCalendarProps {
  programmeName: string;
  programmeUrl: string;
  deadlines: DeadlineItem[];
  className?: string;
}

export const AddToCalendar: React.FC<AddToCalendarProps> = ({
  programmeName,
  programmeUrl,
  deadlines,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const icsContent = generateIcs(programmeName, programmeUrl, deadlines);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${programmeName.toLowerCase().replace(/\s+/g, '-')}-deadlines.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm ${className}`}
      style={{
        minHeight: 'var(--calendar-btn-height)',
        paddingLeft: 'var(--calendar-btn-padding-inline)',
        paddingRight: 'var(--calendar-btn-padding-inline)',
        backgroundColor: 'var(--surface-color, var(--surface))',
        color: 'var(--text-main, var(--text))',
        borderColor: 'var(--surface-border, var(--border))',
      }}
      aria-label="Add remaining programme deadlines to calendar"
    >
      Add to calendar
    </a>
  );
};
