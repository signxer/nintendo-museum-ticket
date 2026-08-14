import { OFFICIAL_CALENDAR_EN } from './officialLinks';

interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

/**
 * Generate Google Calendar Link
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);

  // The event's location is the localized official URL when provided.
  const siteUrl = event.location || OFFICIAL_CALENDAR_EN;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: `${event.description}\n\nURL: ${siteUrl}`,
    dates: `${start}/${end}`,
  });

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

/**
 * Download ICS File
 */
export function downloadIcsFile(event: CalendarEvent) {
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const now = formatDate(new Date());
  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);

  // The event's location is the localized official URL when provided.
  const siteUrl = event.location || OFFICIAL_CALENDAR_EN;

  // RFC 5545 needs a stable UID so re-adding the event updates rather than
  // duplicates it in calendar clients.
  const uid = `nintendo-museum-ticket-${start}@n.675277.xyz`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nintendo Museum Ticket Tool//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}\\n\\nURL: ${siteUrl}`,
    event.location ? `LOCATION:${event.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'nintendo-museum-ticket.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
