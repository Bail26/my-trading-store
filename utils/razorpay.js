"use client";

async function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default async function loadRazorpay(cart) {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    alert("Failed to load Razorpay SDK. Please try again.");
    return;
  }

  try {
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data || !data.id) {
      throw new Error("Failed to initialize Razorpay. Please try again.");
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ✅ Uses environment variables
      amount: data.amount,
      currency: "INR",
      name: "Trading Ocean Store",
      description: "Purchase Digital Products",
      order_id: data.id,
      handler: function (response) {
        console.log("Payment Successful:", response);

        // ✅ Store payment confirmation locally (optional)
        localStorage.setItem("paymentSuccess", "true");

        // ✅ Redirect to download page after successful payment
        const productIds = cart.map((item) => item.id).join(",");
        window.location.href = `/download?products=${productIds}`;

        // ✅ Ensure page refresh (if needed)
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed by user");
          alert("Payment was not completed. Please try again.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay Error:", error);
    alert(error.message);
  }
}
