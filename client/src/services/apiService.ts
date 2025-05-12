export const fetchWatches = async () => {
  const response = await fetch('/api/watches');
  if (!response.ok) {
    throw new Error('Failed to fetch watches');
  }
  const data = await response.json();
  return data.map((watch: any) => ({
    ...watch,
    imageUrl: watch.imageUrl.startsWith('http')
      ? watch.imageUrl
      : `http://localhost:5000${watch.imageUrl.replace(/^\/+/, '')}`,
  }));
};