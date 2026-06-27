'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  progress: number; // 0 to 100
}

export default function MapComponent({ progress }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const pathRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const L = require('leaflet');

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
      }).setView([43.5, 116.5], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);

      // Seoul to UB route
      const route = [
        [37.5665, 126.9780], // Seoul
        [39.5, 124.0],
        [41.5, 120.0],
        [43.65, 111.97], // Border (Erenhot/Zamiin-Uud)
        [45.5, 109.0],
        [47.9200, 106.9200]  // UB
      ];

      const path = L.polyline(route, { color: '#444', weight: 2, dashArray: '4, 8' }).addTo(map);
      pathRef.current = route;

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#fff;width:14px;height:14px;border-radius:50%;box-shadow:0 0 15px rgba(255,255,255,0.8);border:2px solid #000;"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker(route[0], { icon: customIcon }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !pathRef.current || !markerRef.current) return;

    const route = pathRef.current;
    const totalSegments = route.length - 1;
    const scaledProgress = (progress / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const p1 = route[segmentIndex];
    const p2 = route[segmentIndex + 1];

    if (p1 && p2) {
      const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
      const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [progress]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px', background: '#111' }} />;
}
