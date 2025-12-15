/**
 * Calculate time elapsed since a given date
 * @param {string|Date} date - The date to calculate from
 * @returns {string} Human-readable time difference (e.g., "5m ago", "2h ago", "3d ago")
 */

export function getTimeSince(date) {
  const now = new Date();
  const posted = new Date(date);

  if (isNaN(posted.getTime())) {
    console.error('Invalid date:', date);
    return 'Invalid date';
  }

  const diffInMs = now - posted; // milliseconds
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // minutes
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // hours
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // days

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  } else {
    return posted.toLocaleDateString();
  }
}