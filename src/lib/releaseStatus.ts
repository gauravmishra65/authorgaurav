export function isReleased(releaseDate: string): boolean {
  return Date.now() >= new Date(releaseDate).getTime();
}

export function formatReleaseDate(releaseDate: string): string {
  return new Date(releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
