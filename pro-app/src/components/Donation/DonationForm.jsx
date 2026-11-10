// src/components/Donation/DonationForm.jsx

import { useState } from "react";
import axios from "axios";

const DonationForm = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [receiver, setReceiver] = useState("");
  const [purpose, setPurpose] = useState("");
  const [place, setPlace] = useState("");
  const [redirectUrl, setRedirectUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/donations/payfast", {
        amount,
        note,
        receiver,
        purpose,
        place,
      });

      // Backend returns donationId + redirectUrl
      setRedirectUrl(data.redirectUrl);

      // Redirect donor to PayFast sandbox page
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error("Donation error:", err);
      alert("Failed to initiate donation");
    }
  };

  return (
    <div className="donation-form">
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount (ZAR):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <label>
          Note:
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <label>
          Receiver (User ID or Org):
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </label>

        <label>
          Purpose:
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>

        <label>
          Place:
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </label>

        <button type="submit">Donate via PayFast</button>
      </form>

      {redirectUrl && (
        <p>
          Redirecting to PayFast... If not redirected,{" "}
          <a href={redirectUrl}>click here</a>.
        </p>
      )}
    </div>
  );
};

export default DonationForm;
