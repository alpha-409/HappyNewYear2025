import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ to: "everyone", content: "" });
  const [lookupName, setLookupName] = useState("");
  const [highlighted, setHighlighted] = useState([]);

  // 获取所有留言
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (name = "") => {
    const res = await fetch(`/api/messages?name=${name}`);
    const data = await res.json();
    setMessages(data);

    if (name) {
      setHighlighted(data.map((msg) => msg.content));
    } else {
      setHighlighted([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.content) return alert("请输入祝福内容！");

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    if (res.ok) {
      setNewMessage({ to: "everyone", content: "" });
      fetchMessages();
    } else {
      alert("发送失败，请重试！");
    }
  };

  const handleLookup = async () => {
    fetchMessages(lookupName);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <canvas id="matrixRain"></canvas>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          color: "#0F0",
          fontFamily: "monospace",
        }}
      >
        <h1>新年快乐 🎉</h1>
        <div>
          <input
            type="text"
            placeholder="写下你的祝福..."
            value={newMessage.content}
            onChange={(e) =>
              setNewMessage({ ...newMessage, content: e.target.value })
            }
            style={{ marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="To (默认 everyone)"
            value={newMessage.to}
            onChange={(e) =>
              setNewMessage({ ...newMessage, to: e.target.value })
            }
            style={{ marginRight: 10 }}
          />
          <button onClick={handleSendMessage}>发送祝福</button>
        </div>
        <div style={{ marginTop: 20 }}>
          <input
            type="text"
            placeholder="输入名字查找祝福"
            value={lookupName}
            onChange={(e) => setLookupName(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={handleLookup}>查找祝福</button>
        </div>
        <div style={{ marginTop: 20 }}>
          {messages.map((msg, index) => (
            <p
              key={index}
              style={{
                color: highlighted.includes(msg.content) ? "yellow" : "#0F0",
              }}
            >
              To {msg.to}: {msg.content}
            </p>
          ))}
        </div>
      </div>
      <script src="/matrixRain.js"></script>
    </div>
  );
}
