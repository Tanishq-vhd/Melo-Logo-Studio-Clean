import Razorpay from "razorpay";

let razorpayInstance = null;

export const getRazorpay = () => {
  if (!razorpayInstance) {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      throw new Error("Razorpay env vars not loaded");
    }

    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
};
