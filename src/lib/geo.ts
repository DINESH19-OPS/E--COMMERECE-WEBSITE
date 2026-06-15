export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(url, {
      headers: {
        // Nominatim requests a valid User-Agent; set one that's generic
        'User-Agent': 'VoltStore/1.0 (contact@voltstore.example)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const countryCode = data?.address?.country_code;
    return countryCode ? String(countryCode).toUpperCase() : null;
  } catch (e) {
    console.error('reverseGeocode error', e);
    return null;
  }
}

export function requestGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return reject(new Error('Geolocation not available'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 1000 * 60 * 60 });
  });
}
