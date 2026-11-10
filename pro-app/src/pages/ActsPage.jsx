// pro-app/src/pages/ActsPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaListAlt, FaClock } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth.js";
import { getMyActs, acceptInvite, denyInvite } from "../services/actService.js";

export default function ActsPage() {
  const { user } = useAuth();
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Track which act is currently being denied and its input reason
  const [denyingActId, setDenyingActId] = useState(null);
  const [denialReason, setDenialReason] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchActs = async () => {
      try {
        const res = await getMyActs();
        if (isMounted) setActs(res || []);
      } catch (err) {
        console.error("Error fetching acts:", err);
        toast.error("Failed to load acts");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActs();

    // Optional: Periodically re-check expiration timestamps every 30 seconds
    const interval = setInterval(() => {
      setActs((prev) => [...prev]); // Triggers UI re-evaluation for time-based expiration
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAccept = async (actId, code) => {
    setActionLoading((prev) => ({ ...prev, [actId]: "accept" }));

    setActs((prev) =>
      prev.map((act) =>
        act._id === actId ? { ...act, status: "confirmed" } : act,
      ),
    );

    try {
      await acceptInvite(code);
      toast.success("Act accepted!");
    } catch (err) {
      console.error("Error accepting act:", err);
      toast.error("Failed to accept act");
      setActs((prev) =>
        prev.map((act) =>
          act._id === actId ? { ...act, status: "pending" } : act,
        ),
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [actId]: null }));
    }
  };

  const handleConfirmDeny = async (actId, code) => {
    setActionLoading((prev) => ({ ...prev, [actId]: "deny" }));

    setActs((prev) =>
      prev.map((act) =>
        act._id === actId ? { ...act, status: "denied", denialReason } : act,
      ),
    );

    try {
      await denyInvite(code, denialReason || "No reason provided");
      toast.success("Act denied!");
      setDenyingActId(null);
      setDenialReason("");
    } catch (err) {
      console.error("Error denying act:", err);
      toast.error("Failed to deny act");
      setActs((prev) =>
        prev.map((act) =>
          act._id === actId ? { ...act, status: "pending" } : act,
        ),
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [actId]: null }));
    }
  };

  if (loading) return <p className="text-gray-400 p-6">Loading acts...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold flex items-center text-cyan-400 mb-6">
        <FaListAlt className="mr-2" /> My Acts
      </h1>

      {acts.length === 0 ? (
        <p className="text-gray-500">No acts found.</p>
      ) : (
        <ul className="space-y-4">
          {acts.map((act) => {
            const helperId = act.helper
              ? typeof act.helper === "object"
                ? (act.helper._id || act.helper.id)?.toString()
                : act.helper.toString()
              : null;

            const currentUserId = user
              ? (user._id || user.id)?.toString()
              : null;

            const isHelper = Boolean(
              currentUserId && helperId && currentUserId === helperId,
            );

            // Check if invite code has an expiration date and if it's expired
            // Assumes invite object or expiresAt field exists on act (adjust field name if your backend uses expiresAt / inviteExpiresAt)
            const expiryTime =
              act.expiresAt || act.inviteExpiresAt || act.invite?.expiresAt;
            const isExpired = expiryTime
              ? new Date().getTime() > new Date(expiryTime).getTime()
              : false;

            // Determine effective status (auto-show expired if pending and time passed)
            const effectiveStatus =
              act.status === "pending" && isExpired ? "expired" : act.status;

            const currentLoading = actionLoading[act._id];
            const isDisabled =
              Boolean(currentLoading) || effectiveStatus === "expired";
            const isDenyingThis = denyingActId === act._id;

            return (
              <li
                key={act._id}
                className="p-4 rounded-lg shadow bg-gray-800 text-white border border-gray-700 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-lg">{act.description}</p>
                  {isHelper && (
                    <span className="text-xs bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded border border-cyan-700">
                      Created by You
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  Type: {act.actType} | Value: {act.value} | Place: {act.place}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <p>
                    Status:{" "}
                    <span
                      className={
                        effectiveStatus === "confirmed"
                          ? "text-green-400 font-bold"
                          : effectiveStatus === "pending"
                            ? "text-yellow-400 font-bold"
                            : effectiveStatus === "expired"
                              ? "text-orange-400 font-bold fle items-center gap-1 inline-flex"
                              : "text-red-400 font-bold"
                      }
                    >
                      {effectiveStatus === "expired" && (
                        <FaClock className="text-xs" />
                      )}
                      {effectiveStatus.charAt(0).toUpperCase() +
                        effectiveStatus.slice(1)}
                    </span>
                  </p>
                  {act.inviteCode && (
                    <span className="text-xs font-mono bg-gray-900 px-2 py-1 rounded border border-gray-700 text-gray-300">
                      Code: {act.inviteCode}
                    </span>
                  )}
                </div>

                {effectiveStatus === "denied" && act.denialReason && (
                  <p className="text-xs text-red-300 italic">
                    Reason: {act.denialReason}
                  </p>
                )}

                {/* Show Accept/Deny ONLY if user is RECEIVER, act is pending, and code is NOT expired */}
                {effectiveStatus === "pending" &&
                  act.inviteCode &&
                  !isHelper && (
                    <div className="mt-3">
                      {!isDenyingThis ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleAccept(act._id, act.inviteCode)
                            }
                            disabled={isDisabled}
                            className="px-3 py-1 rounded text-sm bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {currentLoading === "accept"
                              ? "Accepting..."
                              : "Accept"}
                          </button>

                          <button
                            onClick={() => {
                              setDenyingActId(act._id);
                              setDenialReason("");
                            }}
                            disabled={isDisabled}
                            className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        /* Inline Denial Form */
                        <div className="mt-2 p-3 bg-gray-900 rounded border border-red-500/40 space-y-2">
                          <input
                            type="text"
                            placeholder="State reason for denying..."
                            value={denialReason}
                            onChange={(e) => setDenialReason(e.target.value)}
                            className="w-full px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleConfirmDeny(act._id, act.inviteCode)
                              }
                              disabled={isDisabled}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white cursor-pointer"
                            >
                              {currentLoading === "deny"
                                ? "Denying..."
                                : "Confirm Deny"}
                            </button>
                            <button
                              onClick={() => setDenyingActId(null)}
                              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Helper pending message or Expired notice */}
                {effectiveStatus === "pending" && isHelper && (
                  <p className="text-xs text-yellow-500/80 italic mt-2">
                    Awaiting receiver confirmation...
                  </p>
                )}

                {effectiveStatus === "expired" && (
                  <p className="text-xs text-orange-400/90 italic mt-2">
                    This invite code has expired and can no longer be accepted.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
