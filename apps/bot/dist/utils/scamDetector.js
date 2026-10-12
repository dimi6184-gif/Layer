import axios from 'axios';
import { GoogleGenAI, Type } from '@google/genai'; // Neues Google SDK
console.log('[ScamDetector] Module loading...');
// ─── Gemini Structured Outputs Configuration ────────────────────────────────
const ScamAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        isScam: { type: Type.BOOLEAN, description: "True if the image contains scam, phishing, or fraudulent content." },
        confidence: { type: Type.INTEGER, description: "Confidence score from 0 to 100." },
        reason: { type: Type.STRING, description: "Brief explanation of what elements were detected." }
    },
    required: ["isScam", "confidence", "reason"],
};
// ─── Queue for Image Analysis ───────────────────────────────────────────────
let imageAnalysisQueue = Promise.resolve();
const MAX_QUEUE_SIZE = 5;
let queueSize = 0;
async function enqueueImageAnalysis(task) {
    if (queueSize >= MAX_QUEUE_SIZE) {
        console.warn('[Scam Detector] Queue full, skipping image analysis');
        return null;
    }
    queueSize++;
    const result = await (imageAnalysisQueue = imageAnalysisQueue
        .then(task)
        .catch((err) => {
        console.error('[Scam Detector] Queue task failed:', err.message);
        return null;
    })
        .finally(() => {
        queueSize--;
    }));
    return result;
}
// ─── Gemini Vision API Execution ───────────────────────────────────────────
async function analyzeImageWithGemini(imageUrl) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }
    console.log(`[Scam Detector] 🧠 Downloading image: ${imageUrl}`);
    const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
    });
    const imageBuffer = Buffer.from(imageResponse.data);
    const base64Image = imageBuffer.toString('base64');
    const contentType = imageResponse.headers['content-type'];
    const mimeType = (typeof contentType === 'string' ? contentType : 'image/png');
    console.log(`[Scam Detector] 🧠 Image downloaded (${imageBuffer.length} bytes), analyzing with Gemini 3.5 Flash...`);
    // Initialisierung mit neuem SDK
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this image for scam/phishing content. Look for:
CRITICAL SCAM INDICATORS:
- Fake withdrawal/payment success messages
- Cryptocurrency scams with money amounts
- Fake Discord Nitro/Steam/gift card offers
- Casino rakeback/cashback screenshots
- Green checkmarks with money amounts`;
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
            prompt,
            { inlineData: { data: base64Image, mimeType } },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: ScamAnalysisSchema,
        }
    });
    const text = response.text;
    if (!text)
        throw new Error('Invalid empty response from Gemini');
    console.log(`[Scam Detector] 🧠 Gemini response: ${text}`);
    const analysis = JSON.parse(text);
    return {
        isScam: analysis.isScam || false,
        confidence: analysis.confidence || 0,
        reason: analysis.reason || 'Analysis completed',
        tokens: response.usageMetadata?.totalTokenCount || 1200,
    };
}
// ─── Keyword Lists ──────────────────────────────────────────────────────────
const SCAM_KEYWORDS = {
    high: [
        'withdrawal succeed', 'withdrawal successful', 'claim your', 'free crypto',
        'verify wallet', 'airdrop', 'double your', 'free nitro', 'discord nitro gift',
        'cashback', 'rakeback', 'andrew tate', 'hustlers university',
    ],
    medium: [
        'crypto', 'bitcoin', 'ethereum', 'nft', 'wallet', 'metamask', 'binance',
        'withdrawal', 'trading', 'investment', 'profit', 'giveaway', 'free money',
    ],
    low: [
        'click here', 'link in bio', 'dm me', 'urgent', 'limited', 'exclusive',
    ],
};
const SUSPICIOUS_DOMAINS = [
    'bit.ly', 'tinyurl.com', 'discord.gift', 'discordgift', 'steamcommunity.ru',
];
// ─── Text Analysis Function ────────────────────────────────────────────────
export function analyzeTextForScam(text, sensitivity = 'medium') {
    const lowerText = text.toLowerCase();
    let score = 0;
    const reasons = [];
    for (const keyword of SCAM_KEYWORDS.high) {
        if (lowerText.includes(keyword)) {
            score += 30;
            reasons.push(`High-risk: "${keyword}"`);
        }
    }
    for (const keyword of SCAM_KEYWORDS.medium) {
        if (lowerText.includes(keyword)) {
            score += 10;
            reasons.push(`Medium-risk: "${keyword}"`);
        }
    }
    for (const keyword of SCAM_KEYWORDS.low) {
        if (lowerText.includes(keyword)) {
            score += 5;
        }
    }
    for (const domain of SUSPICIOUS_DOMAINS) {
        if (lowerText.includes(domain)) {
            score += 25;
            reasons.push(`Suspicious domain: ${domain}`);
        }
    }
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = text.match(urlRegex) || [];
    for (const url of urls) {
        if (url.includes('discord') && !url.includes('discord.com') && !url.includes('discord.gg')) {
            score += 20;
            reasons.push('Fake Discord URL');
        }
        if (url.includes('steam') && !url.includes('steampowered.com') && !url.includes('steamcommunity.com')) {
            score += 20;
            reasons.push('Fake Steam URL');
        }
    }
    const thresholds = { low: 80, medium: 50, high: 30 };
    const threshold = thresholds[sensitivity];
    return {
        isScam: score >= threshold,
        confidence: Math.min(score, 100),
        reason: reasons.slice(0, 3).join(', ') || 'No scam indicators found',
    };
}
// ─── Image Analysis Function ───────────────────────────────────────────────
export async function analyzeImageForScam(imageUrl, sensitivity = 'medium') {
    const result = await enqueueImageAnalysis(async () => {
        try {
            const geminiResult = await analyzeImageWithGemini(imageUrl);
            const thresholds = { low: 80, medium: 60, high: 40 };
            const threshold = thresholds[sensitivity];
            return {
                isScam: geminiResult.confidence >= threshold,
                confidence: geminiResult.confidence,
                reason: geminiResult.reason,
                aiUsed: true,
                tokens: geminiResult.tokens,
            };
        }
        catch (error) {
            console.error(`[Scam Detector] Image analysis error: ${error.message}`);
            return { isScam: false, confidence: 0, reason: 'AI unavailable', aiUsed: false, tokens: 0 };
        }
    });
    return result || { isScam: false, confidence: 0, reason: 'Queue full', aiUsed: false, tokens: 0 };
}
// ─── MAIN DETECTION FUNCTION (Kombiniert Text + Bild) ─────────────────────
export async function detectScam(message, sensitivity = 'medium') {
    console.log(`[Scam Detector] 🚀 Starting detection (sensitivity: ${sensitivity})`);
    // 1. Text-Analyse durchführen
    const textResult = analyzeTextForScam(message.content || '', sensitivity);
    let finalResult = {
        isScam: textResult.isScam,
        confidence: textResult.confidence,
        reason: textResult.reason,
        type: 'text',
        tokens: 0
    };
    // Wenn der Text bereits eindeutig Scam ist, stoppen wir hier (spart API-Aufrufe)
    if (finalResult.isScam && finalResult.confidence >= 80) {
        finalResult.type = 'fast';
        return finalResult;
    }
    // 2. Bild-Analyse durchführen, falls Anhänge existieren
    const attachment = message.attachments.first();
    if (attachment && attachment.contentType?.startsWith('image/')) {
        const imageResult = await analyzeImageForScam(attachment.url, sensitivity);
        if (imageResult.aiUsed) {
            // Kombinations-Logik: Wenn Bild ODER Text Scam anschlagen
            const isScamCombined = finalResult.isScam || imageResult.isScam;
            const highestConfidence = Math.max(finalResult.confidence, imageResult.confidence);
            const combinedReasons = [];
            if (textResult.confidence > 0)
                combinedReasons.push(`[Text] ${textResult.reason}`);
            if (imageResult.confidence > 0)
                combinedReasons.push(`[Image] ${imageResult.reason}`);
            finalResult = {
                isScam: isScamCombined,
                confidence: highestConfidence,
                reason: combinedReasons.join(' | ') || 'Analyzed text and image',
                type: 'both',
                tokens: imageResult.tokens
            };
        }
    }
    return finalResult;
}
