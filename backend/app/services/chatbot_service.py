from ..config import settings

SYSTEM_PROMPT_BASE = """You are an expert agricultural advisor for Indian farmers. Your name is Cultivate AI.
You provide practical, actionable advice on:
- Crop selection and management
- Soil health and fertilizer recommendations
- Plant disease identification and treatment
- Weather-based farming decisions
- Organic farming practices
- Government schemes for farmers in India
- Modern farming techniques

Keep your responses concise, practical, and easy to understand.
If asked about topics outside agriculture, politely redirect to farming-related topics.
Use simple language that farmers can easily understand.
When relevant, mention specific crop varieties, fertilizers, or pesticides by name.
"""

LANG_INSTRUCTIONS = {
    "hi": "\n\nIMPORTANT: You MUST respond in Hindi (हिन्दी). Use Devanagari script.",
    "mr": "\n\nIMPORTANT: You MUST respond in Marathi (मराठी). Use Devanagari script.",
}


async def get_chat_response(message: str, history: list[dict] | None = None, lang: str = "en") -> str:
    """Get a response from Google Gemini AI for farming-related queries."""
    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return _get_fallback_response(message, lang)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        # Build contents with history
        contents = []
        if history:
            for msg in history:
                role = "user" if msg["role"] == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg["content"]}]})
        contents.append({"role": "user", "parts": [{"text": message}]})

        system_prompt = SYSTEM_PROMPT_BASE + LANG_INSTRUCTIONS.get(lang, "")
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=contents,
            config={"system_instruction": system_prompt},
        )
        return response.text

    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "quota" in error_str.lower():
            print(f"Gemini rate limited, using fallback")
        else:
            print(f"Gemini API error: {e}")
        return _get_fallback_response(message, lang)


def _get_fallback_response(message: str, lang: str = "en") -> str:
    """Provide detailed responses when Gemini API is not available."""
    message_lower = message.lower()

    # For non-English, wrap with a language note
    if lang == "hi":
        suffix = "\n\n_(AI सहायक वर्तमान में हिंदी में सीमित है। पूर्ण हिंदी समर्थन के लिए कृपया बाद में पुनः प्रयास करें।)_"
    elif lang == "mr":
        suffix = "\n\n_(AI सहाय्यक सध्या मराठीत मर्यादित आहे. पूर्ण मराठी समर्थनासाठी कृपया नंतर पुन्हा प्रयत्न करा.)_"
    else:
        suffix = ""

    if any(word in message_lower for word in ["hello", "hi", "hey", "namaste", "help"]):
        return (
            "Namaste! I'm **Cultivate AI**, your smart farming assistant. Here's what I can help you with:\n\n"
            "🌾 **Crop Recommendations** — Tell me your soil NPK, pH, and weather conditions\n"
            "🧪 **Fertilizer Advice** — I'll analyze your soil and suggest the right nutrients\n"
            "🍃 **Disease Detection** — Upload a leaf photo and I'll identify the problem\n"
            "🌤️ **Weather Insights** — Get forecasts to plan your farming schedule\n"
            "📋 **Government Schemes** — Ask about PM-KISAN, PMFBY, KCC, and more\n\n"
            "Try asking: *'What crops grow best in summer?'* or *'How to improve soil nitrogen?'*"
        )

    if any(word in message_lower for word in ["rice", "paddy", "dhan"]):
        return (
            "**Rice (Paddy) Farming Guide:**\n\n"
            "🌱 **Best Season:** Kharif (June–November)\n"
            "🌡️ **Ideal Temperature:** 20–35°C with high humidity\n"
            "💧 **Water Needs:** 1200–1500mm rainfall; standing water during growth\n"
            "🧪 **Soil:** Clay or loamy soil with pH 5.5–6.5\n"
            "📦 **NPK Requirement:** N: 80-120 kg/ha, P: 40-60 kg/ha, K: 40-60 kg/ha\n\n"
            "**Popular Varieties:** Basmati 1121, Sona Masuri, IR-64, Pusa 44\n\n"
            "**Tips:** Use SRI (System of Rice Intensification) method to reduce water usage by 30–40% "
            "while increasing yield. Apply zinc sulphate at 25 kg/ha during land preparation."
        )

    if any(word in message_lower for word in ["wheat", "gehu"]):
        return (
            "**Wheat Farming Guide:**\n\n"
            "🌱 **Best Season:** Rabi (November–March)\n"
            "🌡️ **Ideal Temperature:** 15–25°C (cool winters, warm spring)\n"
            "💧 **Water Needs:** 4–6 irrigations at critical stages\n"
            "🧪 **Soil:** Well-drained loamy soil, pH 6.0–7.5\n"
            "📦 **NPK:** N: 120-150 kg/ha, P: 60 kg/ha, K: 40 kg/ha\n\n"
            "**Popular Varieties:** HD-3226, PBW-725, DBW-187\n\n"
            "**Tips:** First irrigation at 21 days (crown root stage) is critical. "
            "Apply half nitrogen at sowing, half at first irrigation."
        )

    if any(word in message_lower for word in ["summer", "garmi", "grishma"]):
        return (
            "**Best Summer Crops in India (March–June):**\n\n"
            "1. **Watermelon** — High profit, needs hot weather (25–35°C)\n"
            "2. **Muskmelon** — Sandy loam soil, 60–90 days to harvest\n"
            "3. **Cucumber** — Good for intercropping, fast growth\n"
            "4. **Moong (Green Gram)** — Short duration (60–65 days), improves soil nitrogen\n"
            "5. **Sunflower** — Drought-tolerant, good oil content\n"
            "6. **Groundnut** — Sandy soil, 100–130 days to harvest\n"
            "7. **Vegetables:** Okra (Bhindi), Bottle Gourd (Lauki), Bitter Gourd (Karela)\n\n"
            "**Tip:** Mulching helps retain soil moisture and reduces irrigation by 30% in summer."
        )

    if any(word in message_lower for word in ["winter", "rabi", "sardi"]):
        return (
            "**Best Rabi/Winter Crops (October–March):**\n\n"
            "1. **Wheat** — India's main rabi crop, 120–150 days\n"
            "2. **Mustard** — Good for North India, oil + fodder\n"
            "3. **Chickpea (Chana)** — Low water, high protein, fixes nitrogen\n"
            "4. **Peas** — Quick returns, 60–90 days\n"
            "5. **Potato** — High yield, high demand\n"
            "6. **Lentil (Masoor)** — Minimal irrigation needed\n"
            "7. **Vegetables:** Cauliflower, Cabbage, Spinach, Carrot, Radish\n\n"
            "**Tip:** Rabi crops benefit from residual moisture from monsoon. "
            "Use zero-tillage for wheat to save costs."
        )

    if any(word in message_lower for word in ["crop", "grow", "plant", "seed", "kharif", "monsoon"]):
        return (
            "**Crop Selection Guide:**\n\n"
            "Choosing the right crop depends on:\n"
            "• **Soil type** — Clay, loamy, sandy, or black soil\n"
            "• **NPK levels** — Get a soil test done at your nearest KVK (free!)\n"
            "• **Season** — Kharif (June–Oct), Rabi (Nov–Mar), Zaid (Mar–Jun)\n"
            "• **Water availability** — Irrigation vs rainfed\n"
            "• **Market demand** — Check local mandi prices\n\n"
            "Use our **Crop Recommendation** tool — enter your soil NPK, pH, temperature, "
            "humidity, and rainfall, and our ML model will suggest the best crop.\n\n"
            "**Quick picks by soil:**\n"
            "• Sandy soil → Groundnut, Watermelon, Bajra\n"
            "• Clay soil → Rice, Wheat, Sugarcane\n"
            "• Loamy soil → Almost all crops thrive!"
        )

    if any(word in message_lower for word in ["fertilizer", "nutrient", "npk", "urea", "dap", "khad"]):
        return (
            "**Fertilizer Guide for Indian Farmers:**\n\n"
            "🧪 **Understanding NPK:**\n"
            "• **N (Nitrogen)** — Leaf growth, green color. Deficiency = yellowing\n"
            "• **P (Phosphorous)** — Root & flower development. Deficiency = purple leaves\n"
            "• **K (Potassium)** — Fruit quality, disease resistance. Deficiency = brown edges\n\n"
            "**Common Fertilizers:**\n"
            "• Urea (46% N) — ₹266/bag, best for nitrogen\n"
            "• DAP (18% N, 46% P) — ₹1350/bag, best for phosphorus\n"
            "• MOP (60% K) — ₹900/bag, best for potassium\n"
            "• NPK 10:26:26 — Balanced mix for most crops\n\n"
            "Use our **Fertilizer Recommendation** tool for specific advice based on your soil values."
        )

    if any(word in message_lower for word in ["disease", "sick", "leaf", "spot", "rot", "pest", "bimari", "kida"]):
        return (
            "**Plant Disease & Pest Management:**\n\n"
            "📸 **Quick Diagnosis:** Upload a leaf photo in our Disease Detection tool!\n\n"
            "**Common Signs:**\n"
            "• Yellow/brown spots → Fungal infection (use Mancozeb/Carbendazim)\n"
            "• White powder on leaves → Powdery mildew (use Sulphur spray)\n"
            "• Curling leaves → Viral or pest attack (check for whiteflies)\n"
            "• Wilting despite water → Root rot or bacterial wilt\n"
            "• Holes in leaves → Caterpillar/borer damage\n\n"
            "**Prevention Tips:**\n"
            "1. Practice crop rotation every season\n"
            "2. Use neem oil spray (5ml/L) as organic pesticide\n"
            "3. Ensure proper spacing between plants for air circulation\n"
            "4. Remove and burn infected plant parts immediately\n"
            "5. Use disease-resistant seed varieties"
        )

    if any(word in message_lower for word in ["soil", "mitti"]):
        return (
            "**Soil Health Management:**\n\n"
            "🌍 **Soil Testing:** Get free soil testing at your nearest KVK or Soil Testing Lab. "
            "Carry 500g soil from 6-inch depth.\n\n"
            "**Improving Soil Health:**\n"
            "• **Low Nitrogen:** Add vermicompost, green manure (dhaincha/sunhemp), or FYM\n"
            "• **Low Phosphorus:** Apply bone meal, rock phosphate, or SSP\n"
            "• **Low Potassium:** Use wood ash, banana peels, or MOP\n"
            "• **Acidic soil (pH < 6):** Apply lime (2–4 quintal/ha)\n"
            "• **Alkaline soil (pH > 8):** Apply gypsum (2–5 quintal/ha)\n\n"
            "**Organic options:** Jeevamrut, Beejamrut, Panchagavya — proven in natural farming."
        )

    if any(word in message_lower for word in ["weather", "rain", "barish", "mausam"]):
        return (
            "**Weather & Farming:**\n\n"
            "Check our **Weather Dashboard** for live conditions and 5-day forecasts!\n\n"
            "**Weather-based Tips:**\n"
            "• **Before rain:** Apply fertilizers so rain dissolves them into soil\n"
            "• **Heavy rain expected:** Ensure field drainage; avoid spraying pesticides\n"
            "• **Dry spell:** Use mulching to retain moisture; irrigate early morning\n"
            "• **Frost warning:** Cover nurseries; irrigate the night before\n"
            "• **High humidity:** Watch for fungal diseases; increase plant spacing\n\n"
            "**Useful apps:** IMD Mausam, Meghdoot, DAMINI (lightning alert)"
        )

    if any(word in message_lower for word in ["scheme", "yojana", "government", "subsidy", "pm-kisan", "loan", "kcc"]):
        return (
            "**Key Government Schemes for Indian Farmers:**\n\n"
            "💰 **PM-KISAN:** ₹6,000/year in 3 installments. Register at pmkisan.gov.in\n"
            "🛡️ **PMFBY (Crop Insurance):** Premium only 2% for Kharif, 1.5% for Rabi. "
            "Register through bank or CSC\n"
            "💳 **KCC (Kisan Credit Card):** Loan up to ₹3 lakh at 4% interest. "
            "Apply at any bank\n"
            "🏗️ **SMAM:** 50–80% subsidy on farm machinery. Apply on agrimachinery.nic.in\n"
            "🌊 **PMKSY (Micro Irrigation):** 55–90% subsidy on drip/sprinkler. "
            "Apply through state agriculture dept\n"
            "🧑‍🌾 **Soil Health Card:** Free soil testing & recommendations. "
            "Apply at soilhealth.dac.gov.in\n\n"
            "Visit your nearest **CSC (Common Service Center)** or **Agriculture Office** for help applying."
        )

    if any(word in message_lower for word in ["organic", "jaivik", "natural"]):
        return (
            "**Organic & Natural Farming Guide:**\n\n"
            "🌿 **Zero Budget Natural Farming (ZBNF):**\n"
            "• Jeevamrut — Fermented cow dung + urine + jaggery (soil application)\n"
            "• Beejamrut — Seed treatment with cow dung mixture\n"
            "• Mulching — Live + dead mulch for moisture & weed control\n"
            "• Whapasa — Alternate wet-dry irrigation\n\n"
            "**Organic Pest Control:**\n"
            "• Neem oil spray (5ml/L water)\n"
            "• Dashparni ark (10-leaf extract)\n"
            "• Pheromone traps for fruit flies\n"
            "• Yellow sticky traps for whiteflies\n\n"
            "**Certification:** Apply for PGS-India organic certification (free, group-based) "
            "or NPOP certification for export."
        )

    if any(word in message_lower for word in ["water", "irrigation", "paani", "sinchai", "drip"]):
        return (
            "**Smart Irrigation Guide:**\n\n"
            "💧 **Methods (efficiency):**\n"
            "• Flood irrigation — 30–40% efficiency (traditional)\n"
            "• Sprinkler — 60–70% efficiency\n"
            "• Drip irrigation — 90–95% efficiency (BEST)\n\n"
            "**PMKSY Subsidy:** 55% for general, 90% for SC/ST/small farmers on drip/sprinkler\n\n"
            "**Water-saving tips:**\n"
            "1. Irrigate early morning or evening (less evaporation)\n"
            "2. Use mulching to reduce water needs by 30%\n"
            "3. Raised bed planting saves 20–30% water for wheat\n"
            "4. SRI method for rice uses 30–40% less water\n"
            "5. Rainwater harvesting — build farm ponds under MGNREGA scheme"
        )

    return (
        "I'm **Cultivate AI**, your smart farming assistant! I can help with:\n\n"
        "• 🌾 Crop selection (ask about specific crops like rice, wheat, etc.)\n"
        "• 🧪 Fertilizer recommendations\n"
        "• 🍃 Disease identification\n"
        "• 🌤️ Weather-based farming tips\n"
        "• 📋 Government schemes (PM-KISAN, KCC, PMFBY)\n"
        "• 💧 Irrigation and water management\n"
        "• 🌿 Organic farming practices\n\n"
        "Try asking: *'Best crops for summer'*, *'How to improve soil health'*, "
        "*'Tell me about PM-KISAN scheme'*, or *'How to control pests organically?'*"
    ) + suffix
