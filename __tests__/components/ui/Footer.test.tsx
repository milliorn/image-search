import { render, screen } from "@testing-library/react";
import Footer from "@/app/ui/Footer";

describe("Footer", () => {
  it("renders a footer element", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows the current year", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });

  it("shows the author name", () => {
    render(<Footer />);
    expect(screen.getByText("Scott Milliorn")).toBeInTheDocument();
  });

  it("links to the author's GitHub profile", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: "Scott Milliorn" }),
    ).toHaveAttribute("href", "https://github.com/milliorn");
  });
});
