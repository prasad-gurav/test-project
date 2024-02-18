'use client'
export default function Home() {

  const makePayment = async () => {

    console.log("here...");

    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    // Make API call to the serverless API
    const data = await fetch("/api/razorpay", { method: "POST" }, {
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if required
      },
    }).then((t) =>
      t.json()
    );
    console.log(data);

    var options = {
      key: process.env.RAZORPAY_API_KEY, // Enter the Key ID generated from the Dashboard
      name: "Be Watcher - Movie Ticket",
      currency: "INR",
      amount: 5000,
      order_id: data.id,
      description: "Thankyou for your test donation",
      image: "https://manuarora.in/logo.png",
      callback_url: 'http://localhost:3000/api/payment-response',

      handler: function (response) {
        console.log(response)


      },
      prefill: {
        name: "Prasad Gurav",
        email: "psgurav2001@gmail.com",
        contact: "9561242048",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      alert("Payment failed. Please try again. Contact support for help");
    });

  };
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };
  return (
    <main className="">
      <button onClick={makePayment}> Pay Now</button>
    </main>
  );
}
