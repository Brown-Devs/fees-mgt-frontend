// src/pages/admin/Onboarding/steps/LocationSetup.jsx
import { useState, useEffect } from "react";
import api from "../../../../apis/axios";
import { HiOutlineMapPin, HiOutlineCheckCircle } from "react-icons/hi2";

export default function LocationSetup({ school }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ Load saved coordinates on mount
  useEffect(() => {
    if (school?.coordinates?.lat && school?.coordinates?.lng) {
      setLat(String(school.coordinates.lat));
      setLng(String(school.coordinates.lng));
      fetchPlaceName(school.coordinates.lat, school.coordinates.lng);
    }
  }, [school]);

  // Free reverse geocoding — OpenStreetMap Nominatim, no API key needed
  const fetchPlaceName = async (latVal, lngVal) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lngVal}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data?.display_name) {
        const parts = data.display_name.split(",");
        setPlaceName(parts.slice(0, 3).join(", ").trim());
      }
    } catch {
      setPlaceName("");
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("GPS not supported in this browser");
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const latVal = pos.coords.latitude.toFixed(6);
        const lngVal = pos.coords.longitude.toFixed(6);
        setLat(latVal);
        setLng(lngVal);
        setDetecting(false);
        fetchPlaceName(latVal, lngVal);
      },
      () => {
        setDetecting(false);
        alert("Could not detect location. Please enter manually from Google Maps.");
      },
      { enableHighAccuracy: true }
    );
  };

  const lookupManual = () => {
    if (lat && lng) fetchPlaceName(lat, lng);
  };

  const save = async () => {
    if (!lat || !lng) return alert("Please enter or detect location first");
    setSaving(true);
    try {
      await api.put(`/api/schools/${school._id}/settings`, {
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save location. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const hasCoords = lat && lng;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">School Location</h2>
          <p className="text-sm text-slate-500 mt-1">
            Teachers must be within 100m of this location to mark attendance
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 4 of 6
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0b1f3a] to-[#162e52]" />
        <div className="p-8 space-y-8">

          {/* Already saved badge */}
          {school?.coordinates?.lat && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <HiOutlineCheckCircle className="text-green-600 text-lg shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Location already saved{placeName ? ` — ${placeName}` : ""}
              </p>
            </div>
          )}

          {/* Detect button */}
          <div className="bg-[#eef2ff] border border-[#c7d2fe] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0a1a44] mb-1">
              📍 Recommended: Auto-detect location
            </p>
            <p className="text-xs text-slate-500 mb-4">
              <strong>Be physically at your school</strong> when you click this button.
              Your browser will capture the GPS coordinates automatically.
            </p>
            <button
              onClick={detectLocation}
              disabled={detecting}
              className="px-5 py-2.5 bg-[#0b1f3a] text-white rounded-lg text-sm font-medium hover:bg-[#091a30] transition disabled:opacity-60 flex items-center gap-2"
            >
              <HiOutlineMapPin />
              {detecting ? "Detecting..." : school?.coordinates?.lat ? "Re-detect Location" : "Detect My Location"}
            </button>
          </div>

          {/* Map preview + place name */}
          {hasCoords && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Free OpenStreetMap embed — no API key */}
              <iframe
                title="School Location Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng) - 0.003},${parseFloat(lat) - 0.003},${parseFloat(lng) + 0.003},${parseFloat(lat) + 0.003}&layer=mapnik&marker=${lat},${lng}`}
                className="w-full h-56 border-0"
              />
              <div className="px-4 py-3 bg-slate-50 flex items-start gap-2 border-t border-slate-200">
                <HiOutlineMapPin className="text-[#0a1a44] mt-0.5 shrink-0 text-lg" />
                <div>
                  {placeName ? (
                    <p className="text-sm font-medium text-slate-800">{placeName}</p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Fetching address...</p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {parseFloat(lat).toFixed(5)}°N · {parseFloat(lng).toFixed(5)}°E
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manual entry — collapsed by default */}
          <details className="group">
            <summary className="text-sm font-medium text-[#0a1a44] cursor-pointer list-none flex items-center gap-2 select-none">
              <span className="group-open:rotate-90 transition-transform inline-block text-xs">▶</span>
              Enter coordinates manually (advanced)
            </summary>
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-200">
              <p className="text-xs text-slate-500">
                Open{" "}
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#0a1a44] underline">
                  Google Maps
                </a>
                , right-click on your school location → click "What's here?" → copy the two numbers shown (e.g. 28.6139, 77.2090).
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Latitude (first number)</label>
                  <input
                    type="number" step="any" value={lat}
                    onChange={e => setLat(e.target.value)}
                    onBlur={lookupManual}
                    placeholder="e.g. 28.6139"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#0b1f3a] outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Longitude (second number)</label>
                  <input
                    type="number" step="any" value={lng}
                    onChange={e => setLng(e.target.value)}
                    onBlur={lookupManual}
                    placeholder="e.g. 77.2090"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#0b1f3a] outline-none transition"
                  />
                </div>
              </div>
            </div>
          </details>

          {/* Save */}
          {saved ? (
            <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
              <HiOutlineCheckCircle className="text-lg" />
              Location saved successfully!
            </div>
          ) : (
            <button
              onClick={save}
              disabled={saving || !hasCoords}
              className="px-6 py-2.5 rounded-lg font-medium bg-[#0b1f3a] text-white hover:bg-[#091a30] transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Location"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
