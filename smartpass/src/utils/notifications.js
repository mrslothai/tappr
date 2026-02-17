import { addHours, addMinutes, isBefore, parseISO } from 'date-fns';

/**
 * Request notification permission
 * @returns {Promise<boolean>} Permission granted
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show a notification
 * @param {string} title 
 * @param {string} body 
 * @param {Object} options 
 */
export function showNotification(title, body, options = {}) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  }
}

/**
 * Schedule notifications for a boarding pass
 * @param {Object} pass - Boarding pass data
 * @returns {Array<number>} Timeout IDs
 */
export function scheduleNotifications(pass) {
  const timeoutIds = [];
  
  if (!pass.boardingTime || !pass.date) {
    console.warn('Missing boarding time or date, cannot schedule notifications');
    return timeoutIds;
  }
  
  try {
    // Parse boarding time
    const boardingDateTime = parseBoardingDateTime(pass.date, pass.boardingTime);
    const now = new Date();
    
    // Schedule 2 hours before
    const twoHoursBefore = addHours(boardingDateTime, -2);
    if (isBefore(now, twoHoursBefore)) {
      const delay = twoHoursBefore.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        showNotification(
          '✈️ Flight Reminder',
          `Your flight ${pass.flight} boards in 2 hours at gate ${pass.gate}`,
          { tag: `${pass.flight}-2h` }
        );
      }, delay);
      timeoutIds.push(timeoutId);
    }
    
    // Schedule 30 minutes before
    const thirtyMinBefore = addMinutes(boardingDateTime, -30);
    if (isBefore(now, thirtyMinBefore)) {
      const delay = thirtyMinBefore.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        showNotification(
          '⏰ Boarding Soon!',
          `Your flight ${pass.flight} boards in 30 minutes at gate ${pass.gate}`,
          { tag: `${pass.flight}-30m` }
        );
      }, delay);
      timeoutIds.push(timeoutId);
    }
    
    // Schedule at boarding time
    if (isBefore(now, boardingDateTime)) {
      const delay = boardingDateTime.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        showNotification(
          '🚨 Boarding Now!',
          `Flight ${pass.flight} is boarding now at gate ${pass.gate}!`,
          { tag: `${pass.flight}-now`, requireInteraction: true }
        );
      }, delay);
      timeoutIds.push(timeoutId);
    }
    
    return timeoutIds;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return timeoutIds;
  }
}

/**
 * Parse boarding date and time into a Date object
 * @param {string} date 
 * @param {string} time 
 * @returns {Date}
 */
function parseBoardingDateTime(date, time) {
  // Handle various date formats
  let dateStr = date;
  
  // Convert "14 FEB 2026" to "2026-02-14"
  const monthMap = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
  };
  
  const monthMatch = date.match(/(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{2,4})/i);
  if (monthMatch) {
    const day = monthMatch[1].padStart(2, '0');
    const month = monthMap[monthMatch[2].toUpperCase()];
    let year = monthMatch[3];
    if (year.length === 2) {
      year = '20' + year;
    }
    dateStr = `${year}-${month}-${day}`;
  }
  
  // Combine date and time
  const [hours, minutes] = time.split(':');
  const dateTimeStr = `${dateStr}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  
  return parseISO(dateTimeStr);
}

/**
 * Clear all scheduled notifications
 * @param {Array<number>} timeoutIds 
 */
export function clearScheduledNotifications(timeoutIds) {
  timeoutIds.forEach(id => clearTimeout(id));
}
