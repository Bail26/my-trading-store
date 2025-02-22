"use client";

async function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = (err) => {
      console.error("Failed to load Razorpay SDK", err);
      reject(false);
    };
    document.body.appendChild(script);
  });
}

export default async function loadRazorpay(cart) {
  if (!cart || cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    alert("Failed to load Razorpay SDK. Please try again.");
    return;
  }

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!razorpayKey) {
    console.error("Razorpay key is missing");
    alert("Payment system is not configured properly. Please try again later.");
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

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Invalid JSON response from API", err);
      alert("Payment initialization failed due to an unexpected response. Please try again.");
      return;
    }

    if (!data || !data.id) {
      alert("Failed to initialize Razorpay. Please try again.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: "INR",
      name: "Trading Ocean Store",
      description: "Purchase Digital Products",
      order_id: data.id,
      handler: function (response) {
        console.log("Payment Successful:", response);
        localStorage.setItem("paymentSuccess", "true");

        window.location.href = `/download?orderId=${data.id}`;

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

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Failed to open Razorpay:", err);
      alert("An error occurred while opening the payment gateway. Please try again.");
    }
  } catch (error) {
    console.error("Razorpay Error:", error);
    alert(error.message);
  }
}
