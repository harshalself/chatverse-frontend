import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";
const TEST_USER = {
  email: "myselfharshal2004@gmail.com",
  password: "harshal2004",
};

const USER_MESSAGES = [
  "Hello! What's your name?",
  "Can you tell me a fun fact?",
  "What's the weather like today?",
  "How do I improve my productivity?",
  "Tell me a joke.",
  "What's the capital of France?",
  "Who won the last FIFA World Cup?",
  "Can you help me with math homework?",
  "What's the meaning of life?",
  "Give me a motivational quote.",
  "How do I learn programming?",
  "What's your favorite book?",
  "Can you summarize the news?",
  "What's the best way to stay healthy?",
  "Tell me about AI.",
  "How do I cook pasta?",
  "What's the latest in technology?",
  "Can you recommend a movie?",
  "How do I manage stress?",
  "Thank you for chatting!",
];

async function simulateLongChatSession() {
  console.log("🚀 === SIMULATING LONG CHAT SESSION (20 MESSAGES) ===\n");
  try {
    // Login
    const loginResponse = await axios.post(
      `${API_BASE_URL}/users/login`,
      TEST_USER
    );
    const token = loginResponse.data.data.token;
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });

    // Get agent
    const agentsResponse = await api.get("/agents");
    const agentId = agentsResponse.data.data[0].id;
    console.log(
      `✅ Using agent: ${agentId} (${agentsResponse.data.data[0].name})`
    );

    // Start chat session
    let sessionId = null;
    for (let i = 0; i < USER_MESSAGES.length; i++) {
      const message = USER_MESSAGES[i];
      let payload: {
        messages: { role: string; content: string }[];
        sessionId?: string;
      } = {
        messages: [{ role: "user", content: message }],
      };
      if (sessionId) payload.sessionId = String(sessionId);
      const chatResponse = await api.post(`/chat/agents/${agentId}`, payload);
      const data = chatResponse.data.data;
      sessionId = data.sessionId;
      console.log(`\n🗨️ User: ${message}`);
      console.log(
        `🤖 Assistant: ${data.message.substring(0, 200)}${
          data.message.length > 200 ? "..." : ""
        }`
      );
    }
    console.log(
      `\n🎉 === CHAT SIMULATION COMPLETE! Session ID: ${sessionId} ===`
    );
  } catch (error: any) {
    console.log("\n❌ === SIMULATION FAILED ===");
    console.log("Error:", error.response?.data || error.message);
  }
}

simulateLongChatSession();
