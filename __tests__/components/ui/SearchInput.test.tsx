import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "@/app/ui/SearchInput";

const baseProps = {
  loading: false,
  onSubmit: jest.fn(),
  searchRef: createRef<HTMLInputElement | null>(),
};

afterEach(() => {
  jest.resetAllMocks();
});

describe("SearchInput", () => {
  it("renders the search input", () => {
    render(<SearchInput {...baseProps} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<SearchInput {...baseProps} />);
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("input has placeholder text", () => {
    render(<SearchInput {...baseProps} />);
    expect(screen.getByRole("searchbox")).toHaveAttribute(
      "placeholder",
      "Type something to search...",
    );
  });

  it("has an accessible label", () => {
    render(<SearchInput {...baseProps} />);
    expect(screen.getByLabelText("Search for images")).toBeInTheDocument();
  });

  it("attaches searchRef to the input element", () => {
    const ref = createRef<HTMLInputElement | null>();

    render(<SearchInput {...baseProps} searchRef={ref} />);
    expect(ref.current).toBe(screen.getByRole("searchbox"));
  });

  describe("when not loading", () => {
    it("input is enabled", () => {
      render(<SearchInput {...baseProps} loading={false} />);
      expect(screen.getByRole("searchbox")).not.toBeDisabled();
    });

    it("button is enabled", () => {
      render(<SearchInput {...baseProps} loading={false} />);

      expect(
        screen.getByRole("button", { name: /search/i }),
      ).not.toBeDisabled();
    });
  });

  describe("when loading", () => {
    it("input is disabled", () => {
      render(<SearchInput {...baseProps} loading={true} />);
      expect(screen.getByRole("searchbox")).toBeDisabled();
    });

    it("button is disabled", () => {
      render(<SearchInput {...baseProps} loading={true} />);
      expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
    });
  });

  describe("form submission", () => {
    it("calls onSubmit when the button is clicked", async () => {
      const user = userEvent.setup();

      render(<SearchInput {...baseProps} />);

      await user.click(screen.getByRole("button", { name: /search/i }));

      expect(baseProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls onSubmit when Enter is pressed in the input", async () => {
      const user = userEvent.setup();

      render(<SearchInput {...baseProps} />);

      await user.click(screen.getByRole("searchbox"));
      await user.keyboard("{Enter}");
      
      expect(baseProps.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
