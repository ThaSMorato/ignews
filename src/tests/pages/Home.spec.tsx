import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";
import { mocked } from "ts-jest/utils";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});

jest.mock("../../services/stripe");

describe("Home Component", () => {
  describe("Page", () => {
    it("renders correctly", () => {
      const product = { priceId: "fakePriceId", amount: "R$10,00" };
      render(<Home product={product} />);

      screen.logTestingPlaygroundURL();

      expect(screen.getByText(`for ${product.amount} month`)).toBeInTheDocument();
    });
  });
  describe("Static props", () => {
    it("Loads correct data", async () => {
      const stripePricesRetrieveMocked = mocked(stripe.prices.retrieve);

      const price = {
        id: "fake-price-id",
        unit_amount: 1000,
      };
      stripePricesRetrieveMocked.mockResolvedValueOnce(price as any);

      const response = await getStaticProps({});

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            product: {
              priceId: price.id,
              amount: "$10.00",
            },
          },
        })
      );
    });
  });
});
