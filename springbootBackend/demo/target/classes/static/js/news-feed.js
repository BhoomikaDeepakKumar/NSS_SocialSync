document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("broadcastForm");
  const feed = document.getElementById("newsFeed");

  // ✅ Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("announcementTitle").value.trim();
    const content = document.getElementById("announcementContent").value.trim();
    const eventLink = document.getElementById("eventLink").value;

    if (!title || !content) {
      alert("Please fill out all required fields.");
      return;
    }

    const message = {
      title: title,
      content: content,
      type: eventLink ? "EVENT" : "GENERAL"
    };

    try {
      // ✅ Send POST request to backend (messages, not announcements)
      const response = await fetch("http://localhost:8083/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      });

      if (!response.ok) throw new Error("Failed to publish message");

      const savedMessage = await response.json();

      // ✅ Add to feed dynamically
      addMessageToFeed(savedMessage, true);

      // ✅ Reset form
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Something went wrong while publishing!");
    }
  });

  // ✅ Utility: Render one message
  function addMessageToFeed(msg, prepend = false) {
    const feedItem = document.createElement("div");
    feedItem.classList.add("feed-item");

    const createdAt = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Just now";

    feedItem.innerHTML = `
      <div class="feed-header">
        <h3 class="feed-title">${msg.title}</h3>
        <span class="feed-date">Published on ${createdAt}</span>
      </div>
      <p class="feed-content">${msg.content}</p>
    `;

    if (prepend) {
      feed.prepend(feedItem); // new messages go on top
    } else {
      feed.appendChild(feedItem);
    }
  }

  // ✅ Load existing messages on page load
  async function loadMessages() {
    try {
      const res = await fetch("http://localhost:8083/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();

      feed.innerHTML = ""; // clear feed

      if (data.length === 0) {
        feed.innerHTML = "<p>No messages yet.</p>";
        return;
      }

      // Sort newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      data.forEach((msg) => addMessageToFeed(msg));
    } catch (err) {
      console.error("Error loading messages", err);
      feed.innerHTML = "<p style='color:red;'>Failed to load messages.</p>";
    }
  }

  loadMessages();
});
