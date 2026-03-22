import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterButtonsGrid from "@/app/ui/FilterButtonsGrid";

const filters = ["cats", "dogs", "nature"];
const onFilterSelect = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

describe("FilterButtonsGrid", () => {
  it("renders a button for each filter", () => {
    render(
      <FilterButtonsGrid
        imageButtons={filters}
        onFilterSelect={onFilterSelect}
      />,
    );
    
    expect(screen.getAllByRole("button")).toHaveLength(filters.length);
  });

  it("capitalizes the first letter of each filter label", () => {
    render(
      <FilterButtonsGrid
        imageButtons={filters}
        onFilterSelect={onFilterSelect}
      />,
    );

    expect(screen.getByRole("button", { name: "Cats" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dogs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nature" })).toBeInTheDocument();
  });

  it("renders nothing when imageButtons is empty", () => {
    render(
      <FilterButtonsGrid imageButtons={[]} onFilterSelect={onFilterSelect} />,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("calls onFilterSelect with the original filter value when a button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterButtonsGrid
        imageButtons={filters}
        onFilterSelect={onFilterSelect}
      />,
    );
    
    await user.click(screen.getByRole("button", { name: "Cats" }));

    expect(onFilterSelect).toHaveBeenCalledTimes(1);
    expect(onFilterSelect).toHaveBeenCalledWith("cats");
  });

  it("calls onFilterSelect independently for each button", async () => {
    const user = userEvent.setup();

    render(
      <FilterButtonsGrid
        imageButtons={filters}
        onFilterSelect={onFilterSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Dogs" }));
    await user.click(screen.getByRole("button", { name: "Nature" }));

    expect(onFilterSelect).toHaveBeenCalledTimes(2);
    expect(onFilterSelect).toHaveBeenNthCalledWith(1, "dogs");
    expect(onFilterSelect).toHaveBeenNthCalledWith(2, "nature");
  });
});
