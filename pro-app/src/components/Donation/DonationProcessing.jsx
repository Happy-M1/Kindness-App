
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DonationProcessing = () => {
  const { donationId } = useParams(); // route like /donations/processing/:donationId
  const navigate = useNavigate();

  useEffect(() => {
    const verifyDonation = async () => {
      try {
        // Poll backend for donation status
        const { data } = await axios.get(`/api/donations/${donationId}`);

        if (data.status === "confirmed") {
          navigate(`/donations/success/${donationId}`);
        } else if (data.status === "denied") {
          navigate(`/donations/cancel/${donationId}`);
        } else {
          // Still pending, retry after short delay
          setTimeout(verifyDonation, 3000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        navigate(`/donations/cancel/${donationId}`);
      }
    };

    verifyDonation();
  }, [donationId, navigate]);

  return (
    <div className="donation-processing">
      <h2>⏳ Processing Your Donation...</h2>
      <p>
        We’re verifying your payment with PayFast. This may take a few seconds.
      </p>
      <p>Please don’t close this page.</p>
    </div>
  );
};

export default DonationProcessing;

