export function formatRelativeTimeEnglish(date: Date): string {
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);

  return `${diffInYears} years ago`;
}
export function formatRelativeTimeArabic(date: Date): string {
  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `منذ ${seconds} ثانية`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `منذ ${hours} ساعة`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `منذ ${days} يوم`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 4) {
    return `منذ ${weeks} أسبوع`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `منذ ${months} شهر`;
  }

  const years = Math.floor(days / 365);

  return `منذ ${years} سنة`;
}
