// backend/src/utils/buildRippleGraph.js

export default function buildRippleGraph(acts) {
  const nodesMap = new Map();
  const edges = [];

  const defaultAvatar =
    "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

  const emailToUserIdMap = new Map();

  acts.forEach((act) => {
    if (act.helper && typeof act.helper === "object") {
      const hId = act.helper._id
        ? act.helper._id.toString()
        : act.helper.toString();
      if (act.helper.email) {
        emailToUserIdMap.set(act.helper.email.toLowerCase().trim(), hId);
      }
    }
    if (act.receiver && typeof act.receiver === "object") {
      const rId = act.receiver._id
        ? act.receiver._id.toString()
        : act.receiver.toString();
      if (act.receiver.email) {
        emailToUserIdMap.set(act.receiver.email.toLowerCase().trim(), rId);
      }
    }
  });

  acts.forEach((act) => {
    const helper = act.helper;
    if (!helper) return;

    const helperId = helper._id ? helper._id.toString() : helper.toString();
    const helperName = helper.username || helper.name || "Unknown Helper";
    const helperEmail = helper.email || "N/A";
    const helperJoined = helper.createdAt || null;
    const helperAvatar = helper.imageUrl || defaultAvatar;

    if (!nodesMap.has(helperId) && helperId !== "undefined") {
      nodesMap.set(helperId, {
        id: helperId,
        username: helperName,
        name: helperName,
        email: helperEmail,
        joinedAt: helperJoined,
        imageUrl: helperAvatar,
        type: "user",
      });
    }

    let targetId = null;
    let targetLabel = "Unknown Receiver";
    let targetEmail = act.receiverEmail || "N/A";
    let targetJoinedAt = null;
    let targetImageUrl = defaultAvatar;

    if (act.receiver) {
      if (
        typeof act.receiver === "object" &&
        (act.receiver._id || act.receiver.username || act.receiver.email)
      ) {
        targetId = act.receiver._id
          ? act.receiver._id.toString()
          : act.receiver.toString();
        targetLabel =
          act.receiver.username ||
          act.receiver.name ||
          act.receiverName ||
          "Unknown Receiver";
        targetEmail = act.receiver.email || act.receiverEmail || "N/A";
        targetJoinedAt = act.receiver.createdAt || null;
        targetImageUrl = act.receiver.imageUrl || defaultAvatar;
      } else {
        targetId = act.receiver.toString();
      }
    } else if (act.receiverEmail) {
      const rawEmail = act.receiverEmail.toLowerCase().trim();
      targetId = emailToUserIdMap.has(rawEmail)
        ? emailToUserIdMap.get(rawEmail)
        : rawEmail;
      targetLabel = act.receiverName || rawEmail;
      targetEmail = rawEmail;
    } else {
      return;
    }

    if (!nodesMap.has(targetId) && targetId) {
      nodesMap.set(targetId, {
        id: targetId,
        username: targetLabel,
        name: targetLabel,
        email: targetEmail,
        joinedAt: targetJoinedAt,
        imageUrl: targetImageUrl,
        type: "user",
      });
    }

    edges.push({
      id: act._id
        ? act._id.toString()
        : `${helperId}-${targetId}-${Math.random()}`,
      source: helperId,
      target: targetId,
      actType: act.actType || "general",
      description:
        act.description || act.actDescription || "No description provided.",
      place: act.place || "N/A",
      status: act.status || "pending",
      color: act.status === "confirmed" ? "#10b981" : "#f59e0b",
      date: act.createdAt || act.date || null, // ✅ Fixed: properly passing act creation date
      from: helperName,
      to: targetLabel,
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}
