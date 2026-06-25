const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 хвилин

function getCacheKey(url, params) {
  return `${url}::${JSON.stringify(params || {})}`;
}

async function cachedGet(axiosInstance, url, params) {
  const key = getCacheKey(url, params);
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[CACHE HIT] ${url}`);
    return cached.data;
  }

  console.log(`[CACHE MISS] ${url}`);
  const { data } = await axiosInstance.get(url, { params });
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

module.exports = { cachedGet };