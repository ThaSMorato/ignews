import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";
import { mocked } from "ts-jest/utils";

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "my-new-post",
    title: "My New Post",
    excerpt: "post excert",
    updatedAt: "10 de Abril",
  },
];

describe("Posts Component", () => {
  describe("Page", () => {
    it("renders correctly", () => {
      render(<Posts posts={posts} />);

      expect(screen.getByText(posts[0].title)).toBeInTheDocument();
    });
  });
  describe("Static props", () => {
    it("Loads correct data", async () => {
      const getPrismicClientMocked = mocked(getPrismicClient);

      getPrismicClientMocked.mockReturnValueOnce({
        query: jest.fn().mockResolvedValueOnce({
          results: [
            {
              uid: "my-new-post",
              data: {
                title: [{ type: "heading", text: "My new Post" }],
                content: [{ type: "paragraph", text: "post content" }],
              },
              last_publication_date: "04-01-2021",
            },
          ],
        }),
      } as any);

      const response = await getStaticProps({});

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            posts: [
              {
                slug: "my-new-post",
                title: "My new Post",
                excerpt: "post content",
                updatedAt: "01 de abril de 2021",
              },
            ],
          },
        })
      );
    });
  });
});
