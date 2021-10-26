import { render, screen } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink Component", () => {
  it("renders correctly", () => {
    render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("is receiving active class when is the route in href", () => {
    render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toHaveClass("active");
  });

  it("is not receiving active class when is not the route in href", () => {
    render(
      <ActiveLink href='/test' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).not.toHaveClass("active");
  });
});
