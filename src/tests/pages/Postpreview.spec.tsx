import { render, screen } from "@testing-library/react";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";
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
      expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    });

    it("redirects user to full post when user is subscribed", () => {
      const subscription = { activeSubscription: "fake-active-subscription" };

      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValueOnce([subscription, false]);

      const useRouterMocked = mocked(useRouter);

      const pushMock = jest.fn();

      useRouterMocked.mockReturnValueOnce({
        push: pushMock,
      } as any);

      render(<Post post={post} />);

      expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`);
    });
  });
  describe("Static props", () => {
    it("Loads correct data", async () => {
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

      const response = await getStaticProps({ params: { slug: post.slug } });

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
