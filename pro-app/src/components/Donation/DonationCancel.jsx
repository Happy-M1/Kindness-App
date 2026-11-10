
//import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DonationCancel = () => {
  const { donationId } = useParams(); // assuming route like /donations/cancel/:donationId
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/donate"); // redirect back to donation form
  };

  return (
    <div className="donation-cancel">
      <h2>⚠️ Donation Not Completed</h2>
      <p>
        It looks like your donation (ID: {donationId}) was cancelled or failed
        during payment. Don’t worry — no funds were deducted.
      </p>

      <div className="options">
        <p>You can try again or return to the home page.</p>
        <button onClick={handleRetry}>Retry Donation</button>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>

      <div className="info">
        <p>
          If you believe this is an error, please contact support with your
          donation ID for assistance.
        </p>
      </div>
    </div>
  );
};

export default DonationCancel;

