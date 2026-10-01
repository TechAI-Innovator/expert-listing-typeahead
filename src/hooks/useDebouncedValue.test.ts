import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not update until the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "n" } },
    );

    rerender({ value: "ni" });
    expect(result.current).toBe("n");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("n");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ni");
  });

  it("only keeps the latest value when the input changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "n" } },
    );

    rerender({ value: "ni" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ value: "nig" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("nig");
  });
});
