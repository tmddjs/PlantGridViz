import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

vi.mock("../api/runLayout.ts", () => ({
  runLayout: vi.fn(),
}));

import RunLayoutButton from "./RunLayoutButton.jsx";
import { runLayout } from "../api/runLayout.ts";

describe("RunLayoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

    it("runs without displaying result", async () => {
      runLayout.mockResolvedValue({ success: true });
      render(<RunLayoutButton selectedPlants={[{ id: 1, name: "A" }]} />);
      fireEvent.click(screen.getByRole("button", { name: /run layout/i }));
      expect(screen.getByRole("button", { name: /running/i })).toBeDisabled();
      await screen.findByRole("button", { name: /run layout/i });
      expect(runLayout).toHaveBeenCalled();
      expect(screen.queryByText(/failed to run layout/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/success/)).not.toBeInTheDocument();
    });

  it("shows error message when run fails", async () => {
    runLayout.mockRejectedValue(new Error("bad"));
    render(<RunLayoutButton selectedPlants={[{ id: 1, name: "A" }]} />);
    fireEvent.click(screen.getByRole("button", { name: /run layout/i }));
    await screen.findByText(/failed to run layout/i);
    expect(screen.queryByText(/success/)).not.toBeInTheDocument();
  });
});
