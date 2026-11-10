

// src/components/Donation/DonationSuccess.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DonationSuccess = () => {
  const { donationId } = useParams(); // assuming route like /donations/success/:donationId
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data } = await axios.get(`/api/donations/${donationId}`);
        setDonation(data);
      } catch (err) {
        console.error("Failed to fetch donation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  if (loading) return <p>Loading donation details...</p>;

  if (!donation) return <p>Donation not found.</p>;

  return (
    <div className="donation-success">
      <h2>🎉 Thank You for Your Donation!</h2>
      <p>Your kindness has been recorded and added to the ripple tree.</p>

      <div className="donation-details">
        <p><strong>Amount:</strong> {donation.amount} ZAR</p>
        <p><strong>Status:</strong> {donation.status}</p>
        <p><strong>Purpose:</strong> {donation.purpose}</p>
        <p><strong>Place:</strong> {donation.place}</p>
        <p><strong>Transaction ID:</strong> {donation.transactionId}</p>
      </div>

      <div className="celebration">
        <p>🌊 Your ripple has spread — both donor and receiver now have new ripple nodes!</p>
      </div>
    </div>
  );
};

export default DonationSuccess;
