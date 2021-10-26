import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";
import { SignInButton } from ".";

jest.mock("next-auth/client");

describe("SignInButton Component", () => {
  it("renders correctly when users is not logged", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when users is logged", () => {
    const session = {
      user: {
        name: "John Doe",
        email: "john.doe@gmail.com",
      },
      expires: "fake-exp",
    };

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([session, false]);

    render(<SignInButton />);

    expect(screen.getByText(session.user.name)).toBeInTheDocument();
  });
});
