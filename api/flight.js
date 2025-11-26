export default async function handler(req, res) {
  const apiKey = process.env.AVIATION_STACK_API_KEY;
  const { flight_iata } = req.query;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Missing API key in environment variables" });
  }

  if (!flight_iata) {
    return res.status(400).json({ error: "Missing flight_iata" });
  }

  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flight_iata}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "AviationStack error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
}
