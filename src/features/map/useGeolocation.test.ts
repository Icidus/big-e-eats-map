import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGeolocation } from "./useGeolocation";

type SuccessCallback = (position: { coords: { latitude: number; longitude: number; accuracy: number } }) => void;
type ErrorCallback = (error: { code: number; message: string }) => void;

function installGeolocation() {
  const watchPosition = vi.fn<(success: SuccessCallback, error: ErrorCallback, options?: unknown) => number>(() => 7);
  const clearWatch = vi.fn();
  Object.defineProperty(navigator, "geolocation", { value: { watchPosition, clearWatch }, configurable: true });
  return { watchPosition, clearWatch };
}

function removeGeolocation() {
  Object.defineProperty(navigator, "geolocation", { value: undefined, configurable: true });
}

afterEach(() => {
  removeGeolocation();
  vi.restoreAllMocks();
});

describe("useGeolocation", () => {
  it("does nothing on mount", () => {
    const { watchPosition } = installGeolocation();
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.status).toBe("idle");
    expect(result.current.position).toBeNull();
    expect(watchPosition).not.toHaveBeenCalled();
  });

  it("tracks after locate() and exposes the position", () => {
    const { watchPosition } = installGeolocation();
    const { result } = renderHook(() => useGeolocation());

    act(() => result.current.locate());
    expect(result.current.status).toBe("requesting");
    expect(watchPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), expect.objectContaining({ enableHighAccuracy: true }));

    act(() => watchPosition.mock.calls[0][0]({ coords: { latitude: 42.0913, longitude: -72.6185, accuracy: 12 } }));
    expect(result.current.status).toBe("tracking");
    expect(result.current.position).toEqual({ lat: 42.0913, lng: -72.6185, accuracyMeters: 12 });
  });

  it("reports denied permission and clears the watch", () => {
    const { watchPosition, clearWatch } = installGeolocation();
    const { result } = renderHook(() => useGeolocation());

    act(() => result.current.locate());
    act(() => watchPosition.mock.calls[0][1]({ code: 1, message: "User denied Geolocation" }));

    expect(result.current.status).toBe("denied");
    expect(clearWatch).toHaveBeenCalledWith(7);
  });

  it("keeps the last position and surfaces a message on transient errors", () => {
    const { watchPosition } = installGeolocation();
    const { result } = renderHook(() => useGeolocation());

    act(() => result.current.locate());
    act(() => watchPosition.mock.calls[0][0]({ coords: { latitude: 42.09, longitude: -72.62, accuracy: 30 } }));
    act(() => watchPosition.mock.calls[0][1]({ code: 3, message: "Timeout expired" }));

    expect(result.current.status).toBe("tracking");
    expect(result.current.position?.lat).toBe(42.09);
    expect(result.current.error).toBe("Timeout expired");
  });

  it("is unavailable when the API is missing", () => {
    removeGeolocation();
    const { result } = renderHook(() => useGeolocation());

    act(() => result.current.locate());
    expect(result.current.status).toBe("unavailable");
  });

  it("stops tracking on stop() and on unmount", () => {
    const { watchPosition, clearWatch } = installGeolocation();
    const { result, unmount } = renderHook(() => useGeolocation());

    act(() => result.current.locate());
    act(() => watchPosition.mock.calls[0][0]({ coords: { latitude: 42.09, longitude: -72.62, accuracy: 30 } }));
    act(() => result.current.stop());
    expect(result.current.status).toBe("idle");
    expect(clearWatch).toHaveBeenCalledTimes(1);

    act(() => result.current.locate());
    unmount();
    expect(clearWatch).toHaveBeenCalledTimes(2);
  });
});
