import { render } from "@testing-library/react";
import { BarLoader } from "react-spinners";
import LoadingIndicator from "@/app/ui/LoadingIndicator";

jest.mock("react-spinners", () => ({
  BarLoader: jest.fn(() => null),
}));

const MockBarLoader = BarLoader as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});

describe("LoadingIndicator", () => {
  it("renders BarLoader", () => {
    render(<LoadingIndicator />);
    expect(MockBarLoader).toHaveBeenCalledTimes(1);
  });

  describe("color prop", () => {
    it("is not passed when undefined", () => {
      render(<LoadingIndicator />);
      expect(MockBarLoader.mock.calls[0][0]).not.toHaveProperty("color");
    });

    it("is passed when provided", () => {
      render(<LoadingIndicator color="#ff0000" />);
      expect(MockBarLoader.mock.calls[0][0]).toHaveProperty("color", "#ff0000");
    });
  });

  describe("height prop", () => {
    it("is not passed when undefined", () => {
      render(<LoadingIndicator />);
      expect(MockBarLoader.mock.calls[0][0]).not.toHaveProperty("height");
    });

    it("is passed when provided", () => {
      render(<LoadingIndicator height={8} />);
      expect(MockBarLoader.mock.calls[0][0]).toHaveProperty("height", 8);
    });
  });

  it("passes both color and height when both are provided", () => {
    render(<LoadingIndicator color="#00ff00" height={4} />);
    const props = MockBarLoader.mock.calls[0][0] as Record<string, unknown>;
    expect(props).toHaveProperty("color", "#00ff00");
    expect(props).toHaveProperty("height", 4);
  });
});
