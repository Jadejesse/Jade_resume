import useSWR from 'swr';

// WMO weather-code -> emoji, matching the original home-script.js icon set.
const weatherIcons = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

const fetcher = (url) => fetch(url).then((response) => response.json());

export function useWeather() {
  const lat = -37.8136;
  const lon = 144.9631;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`;
  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 10 * 60 * 1000,
    revalidateOnFocus: false,
  });

  const current = data?.current_weather;
  const code = current?.weathercode;

  return {
    isLoading,
    error,
    temperature: current ? Math.round(current.temperature) : null,
    icon: weatherIcons[code] || '☀️',
  };
}
