import { useCallback, useEffect, useRef, useState } from "react";

export type GeolocationStatus = "idle" | "requesting" | "tracking" | "denied" | "unavailable";

export interface UserPosition {
  lat: number;
  lng: number;
  accuracyMeters: number;
}

export interface GeolocationState {
  status: GeolocationStatus;
  position: UserPosition | null;
  error: string | null;
  locate(): void;
  stop(): void;
}

const PERMISSION_DENIED = 1;
const WATCH_OPTIONS: PositionOptions = { enableHighAccuracy: true, maximumAge: 5_000, timeout: 20_000 };

function geolocationApi(): Geolocation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return navigator.geolocation ?? undefined;
}

function isSecure(): boolean {
  if (typeof window === "undefined") return false;
  return window.isSecureContext !== false;
}

export function useGeolocation(): GeolocationState {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const clearWatch = useCallback(() => {
    if (watchId.current === null) return;
    geolocationApi()?.clearWatch(watchId.current);
    watchId.current = null;
  }, []);

  const stop = useCallback(() => {
    clearWatch();
    setStatus((current) => (current === "tracking" || current === "requesting" ? "idle" : current));
    setPosition(null);
  }, [clearWatch]);

  const locate = useCallback(() => {
    const api = geolocationApi();
    if (!api || !isSecure()) {
      setStatus("unavailable");
      return;
    }

    clearWatch();
    setStatus("requesting");
    setError(null);
    watchId.current = api.watchPosition(
      (result) => {
        setPosition({ lat: result.coords.latitude, lng: result.coords.longitude, accuracyMeters: result.coords.accuracy });
        setStatus("tracking");
        setError(null);
      },
      (failure) => {
        if (failure.code === PERMISSION_DENIED) {
          clearWatch();
          setStatus("denied");
          return;
        }
        setError(failure.message || "Location is temporarily unavailable.");
      },
      WATCH_OPTIONS,
    );
  }, [clearWatch]);

  useEffect(() => clearWatch, [clearWatch]);

  return { status, position, error, locate, stop };
}
