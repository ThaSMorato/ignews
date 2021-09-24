import { NextApiResponse, NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../../services/stripe";

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1JciKYFaYkFROidbWXzBPmar",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      customer: stripeCustomer.id,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

export default subscribe;
