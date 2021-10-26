import { render, screen } from "@testing-library/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";
import { mocked } from "ts-jest/utils";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>post excert</p>",
  updatedAt: "10 de Abril",
};

jest.mock("next/router");
jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post preview Component", () => {
  describe("Page", () => {
    it("renders correctly", () => {
      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValueOnce([null, false]);

      render(<Post post={post} />);

      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText("post excert")).toBeInTheDocument();
    });
  });
  describe("Server side props", () => {
    it("Redirects user ir no subscrip[tion is found", async () => {
      const getSessionMocked = mocked(getSession);

      getSessionMocked.mockResolvedValueOnce({
        activeSubscription: null,
      } as any);

      const response = await getServerSideProps({
        req: {
          cookies: {},
        },
        params: { slug: post.slug },
      } as any);

      expect(response).toEqual(
        expect.objectContaining({
          redirect: expect.objectContaining({
            destination: `/post/preview/${post.slug}`,
          }),
        })
      );
    });

    it("Loads correct data", async () => {
      const getSessionMocked = mocked(getSession);

      getSessionMocked.mockResolvedValueOnce({
        activeSubscription: "fake-active-subscription",
      } as any);

      const getPrismicClientMocked = mocked(getPrismicClient);

      getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          data: {
            title: [{ type: "heading", text: "My new Post" }],
            content: [{ type: "paragraph", text: "post content" }],
          },
          last_publication_date: "04-01-2021",
        }),
      } as any);

      const response = await getServerSideProps({
        params: { slug: post.slug },
      } as any);

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            post: {
              slug: "my-new-post",
              title: "My new Post",
              content: "<p>post content</p>",
              updatedAt: "01 de abril de 2021",
            },
          },
        })
      );
    });
  });
});
