import { create } from "zustand";
import Cookies from "js-cookie";

export const playerData = create((set) => ({
  user: undefined,
  setUser: (u) => set({ user: u }),
  socket: undefined,
  setSocket: (s) => set({ socket: s }),
  connect: () => {
    const { socket } = playerData.getState();
    if (!socket) {
      connectSocket(set);
    }
  },
  send: (message) => {
    const { socket } = playerData.getState();
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  },
  state: undefined,
  setState: (s) => set({ state: s }),
  credits: 0,
  setCredits: (s) => set({ credits: s }),
  odds: { A: 0, B: 0 }, // Adjusted to reflect only two odds
  setOdds: (newOdds) => {
    set({ odds: { ...newOdds } }); // Update odds for A and B
  },
  chains: [],
  setChains: (s) => set({ chains: s }),
}));

function connectSocket(set) {
  const token = Cookies.get("token");
  if (!token) {
    console.error("Token is missing:", token);
    return;
  }

  const url = `${import.meta.env.VITE_SOCKET}?token=${token}`;
  const s = new WebSocket(url);
  if (!s) {
    return;
  }

  set({ socket: s });

  s.addEventListener("open", () => {
    set({ gameState: "Connecting" });
  });

  s.addEventListener("message", (event) => {
    update(set, event.data);
  });

  s.addEventListener("error", (event) => {
    set({ state: "Error" });
    console.error(event);
  });

  s.addEventListener("close", () => {
    set({ state: "Closed" });
    console.log("Socket closed");
  });

  reset(set);
}

function update(set, eventData) {
  let meta;
  try {
    meta = JSON.parse(eventData);
  } catch (error) {
    console.error("Failed to parse event data:", error);
    return;
  }

  if (!meta) return;

  console.log(meta);

  if (meta.channel === "/ChangeState") {
    EventBus.emit("State", { state: meta.data.state });
  }

  if (meta.data.state === "NewGame") {
    playerData.setState({ chain: [] });
  }

  if (meta.data.state === "Open" || meta.data.state === "Closed") {
    EventBus.emit("Chain", { playerChain: meta.data.playerChain });
    playerData.setState({ chain: meta.data.playerChain });
  }

  if (meta.data.state) set({ state: meta.data.state });
  if (meta.data.credits) set({ credits: meta.data.credits });
  if (meta.data.odds) {
    set({
      odds: {
        A: meta.data.odds.A || 0,
        B: meta.data.odds.B || 0,
      },
    });
  }
}

function reset(set) {
  set({
    odds: { A: 0, B: 0 }, // Reset odds for A and B
  });
}
