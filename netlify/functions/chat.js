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

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing messages array" }),
    };
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
      return {
        statusCode: response.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: data.error?.message || "API error" }),
      };
    }

    const text = data.content?.find((b) => b.type === "text")?.text || "";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply: text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to reach AI service" }),
    };
  }
};
