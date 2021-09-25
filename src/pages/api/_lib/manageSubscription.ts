import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export const saveSubscription = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
): Promise<void> => {
  const userRef = await fauna.query(
    q.Select("ref", q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId)))
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(q.Create(q.Collection("subscriptions"), { data: subscriptionData }));
  } else {
    await fauna.query(
      q.Replace(q.Select("ref", q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))), {
        data: subscriptionData,
      })
    );
  }
};
