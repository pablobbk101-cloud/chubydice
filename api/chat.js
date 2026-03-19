const SYSTEM_PROMPT = `You are the Chuby Dice assistant — a friendly, knowledgeable helper for the Chuby Dice website.

Chuby Dice is Melbourne's premier Dancehall experience, bringing authentic Jamaican Dancehall culture to global stages. Here's what you need to know:

**About Chuby Dice**
- Melbourne-based Dancehall artist, choreographer, and instructor
- Specialises in authentic Jamaican Dancehall culture and movement
- Has performed and taught internationally

**What's On Offer**
- **Dancehall Classes**: Regular classes in Melbourne for all levels (beginner to advanced)
- **Events**: Live Dancehall events and showcases including signature events
- **Coaching**: Private and group coaching sessions for individuals, crews, and professionals
- **Academy**: The Chuby Dice Academy — structured dance education programs
- **Series**: Video/content series including "In Ya City", "Lovers Rock", "March Back in Time", "Full Series" and more
- **Clash**: Dancehall clash events

**Contact & Booking**
- For classes, coaching, and bookings, visitors should use the Contact page on the website
- Classes and events are primarily based in Melbourne, Australia
- Also covers Adelaide events ("In Ya City Adelaide")

**Your Role**
- Answer questions about Chuby Dice, Dancehall culture, classes, events, coaching, and bookings
- Be warm, enthusiastic, and on-brand — Dancehall is joyful, energetic culture
- If you don't know a specific detail (e.g. exact class times or prices), tell the user to check the website or use the contact form
- Keep responses concise and helpful
- Do not make up specific prices, dates, or times you aren't sure about`;

module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const text = data.content?.find((b) => b.type === "text")?.text || "";
    return res.status(200).json({ reply: text });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach AI service" });
  }
};
