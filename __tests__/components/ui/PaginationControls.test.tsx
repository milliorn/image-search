import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationControls from "@/app/ui/PaginationControls";
import { UNSPLASH_MAX_PAGES } from "@/app/utils/constants";

const setPage = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

function renderControls({
  loading = false,
  page = 1,
  totalPages = 10,
}: {
  loading?: boolean;
  page?: number;
  totalPages?: number;
} = {}) {
  return render(
    <PaginationControls
      loading={loading}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
    />,
  );
}

describe("PaginationControls", () => {
  describe("when totalPages is 0", () => {
    it("renders nothing", () => {
      const { container } = renderControls({ totalPages: 0 });
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("page display", () => {
    it("shows current page and total pages", () => {
      renderControls({ page: 3, totalPages: 10 });
      expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
    });

    it("clamps totalPages to UNSPLASH_MAX_PAGES", () => {
      renderControls({ page: 1, totalPages: UNSPLASH_MAX_PAGES + 100 });
      expect(
        screen.getByText(`Page 1 of ${UNSPLASH_MAX_PAGES}`),
      ).toBeInTheDocument();
    });
  });

  describe("Previous button", () => {
    it("is disabled on page 1", () => {
      renderControls({ page: 1 });
      expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    });

    it("is disabled when loading", () => {
      renderControls({ page: 2, loading: true });
      expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    });

    it("is enabled on page > 1 and not loading", () => {
      renderControls({ page: 2 });
      expect(
        screen.getByRole("button", { name: "Previous" }),
      ).not.toBeDisabled();
    });

    it("calls setPage with page - 1 when clicked", async () => {
      const user = userEvent.setup();
      renderControls({ page: 3 });
      await user.click(screen.getByRole("button", { name: "Previous" }));
      expect(setPage).toHaveBeenCalledWith(2);
    });
  });

  describe("Next button", () => {
    it("is disabled on the last page", () => {
      renderControls({ page: 10, totalPages: 10 });
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("is disabled when loading", () => {
      renderControls({ page: 1, loading: true });
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("is enabled when not on last page and not loading", () => {
      renderControls({ page: 1, totalPages: 10 });
      expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();
    });

    it("calls setPage with page + 1 when clicked", async () => {
      const user = userEvent.setup();
      renderControls({ page: 3, totalPages: 10 });
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(setPage).toHaveBeenCalledWith(4);
    });
  });

  describe("page input", () => {
    it("shows the current page", () => {
      renderControls({ page: 5 });
      expect(
        screen.getByRole("spinbutton", { name: "Page Number Input" }),
      ).toHaveValue(5);
    });

    it("syncs with page prop changes", () => {
      const { rerender } = renderControls({ page: 1 });
      rerender(
        <PaginationControls
          loading={false}
          page={5}
          setPage={setPage}
          totalPages={10}
        />,
      );
      expect(
        screen.getByRole("spinbutton", { name: "Page Number Input" }),
      ).toHaveValue(5);
    });
  });

  describe("Go button", () => {
    it("calls setPage with the typed value when clicked", async () => {
      const user = userEvent.setup();
      renderControls({ page: 1, totalPages: 10 });
      const input = screen.getByRole("spinbutton", { name: "Page Number Input" });
      await user.clear(input);
      await user.type(input, "5");
      await user.click(screen.getByRole("button", { name: "Go" }));
      expect(setPage).toHaveBeenCalledWith(5);
    });

    it("calls setPage when Enter is pressed in the input", async () => {
      const user = userEvent.setup();
      renderControls({ page: 1, totalPages: 10 });
      const input = screen.getByRole("spinbutton", { name: "Page Number Input" });
      await user.clear(input);
      await user.type(input, "7");
      await user.keyboard("{Enter}");
      expect(setPage).toHaveBeenCalledWith(7);
    });

    it("is disabled when loading", () => {
      renderControls({ loading: true });
      expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
    });

    it("is disabled when input is out of range", async () => {
      const user = userEvent.setup();
      renderControls({ page: 1, totalPages: 10 });
      const input = screen.getByRole("spinbutton", { name: "Page Number Input" });
      await user.clear(input);
      await user.type(input, "99");
      expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
    });
  });

  describe("stepper buttons", () => {
    it("Decrease button decrements the input value", async () => {
      const user = userEvent.setup();
      renderControls({ page: 5 });
      await user.click(screen.getByRole("button", { name: "Decrease page" }));
      expect(
        screen.getByRole("spinbutton", { name: "Page Number Input" }),
      ).toHaveValue(4);
    });

    it("Decrease button is disabled when input is at 1", () => {
      renderControls({ page: 1 });
      expect(
        screen.getByRole("button", { name: "Decrease page" }),
      ).toBeDisabled();
    });

    it("Increase button increments the input value", async () => {
      const user = userEvent.setup();
      renderControls({ page: 5, totalPages: 10 });
      await user.click(screen.getByRole("button", { name: "Increase page" }));
      expect(
        screen.getByRole("spinbutton", { name: "Page Number Input" }),
      ).toHaveValue(6);
    });

    it("Increase button is disabled at total pages", () => {
      renderControls({ page: 10, totalPages: 10 });
      expect(
        screen.getByRole("button", { name: "Increase page" }),
      ).toBeDisabled();
    });
  });
});
