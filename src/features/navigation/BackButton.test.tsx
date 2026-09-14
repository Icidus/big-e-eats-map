import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { BackButton } from "./BackButton";

afterEach(cleanup);

function Where() {
  const location = useLocation();
  return <div data-testid="where">{location.pathname}{location.search}</div>;
}

function renderAt(entries: Array<string | { pathname: string; search?: string; state?: unknown }>) {
  return render(
    <MemoryRouter initialEntries={entries}>
      <Routes>
        <Route path="/page" element={<><BackButton fallback={{ to: "/browse", label: "Browse all food" }} /><Where /></>} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BackButton", () => {
  it("renders the fallback link when there is no in-app history", () => {
    renderAt(["/page"]);
    expect(screen.getByRole("link", { name: "Browse all food" })).toHaveAttribute("href", "/browse");
  });

  it("goes back in history with the label the originating link passed", async () => {
    const user = userEvent.setup();
    renderAt(["/browse?q=apple", { pathname: "/page", state: { backLabel: "Back to results" } }]);

    await user.click(screen.getByRole("button", { name: "Back to results" }));
    expect(screen.getByTestId("where")).toHaveTextContent("/browse?q=apple");
  });

  it("uses a plain Back label when history exists but no label was passed", () => {
    renderAt(["/", "/page"]);
    expect(screen.getByRole("button", { name: "Back" })).toHaveClass("min-h-11");
  });
});
