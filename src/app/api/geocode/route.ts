import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    if (!lat || !lon) return NextResponse.json({ error: 'lat & lon required' }, { status: 400 });

    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'VoltStore/1.0 (contact@voltstore.example)'
      }
    });
    if (!res.ok) return NextResponse.json({ error: 'geocode failed' }, { status: 502 });
    const data = await res.json();
    const countryCode = data?.address?.country_code ? String(data.address.country_code).toUpperCase() : null;
    return NextResponse.json({ countryCode });
  } catch (err) {
    console.error('api/geocode error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
