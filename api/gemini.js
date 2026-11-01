
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { mood } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    //const apiKey = "AQ.Ab8RN6IFVRyPHF_LJYF_hEukZk3TXtHTBB-BBL6Fb1g3L1hQKQ";

    if (!apiKey) {
        return res.status(500).json({ error: 'APIキーが設定されていません。' });
    }

    const url = `https://googleapis.com{apiKey}`;
    //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const promptText = `私は今【${mood}】という気分です。この気分にぴったりな、元気が出る一言メッセージか、おすすめの過ごし方を50文字程度で優しく提案してください。`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            const reply = data.candidates.content.parts.text;
            return res.status(200).json({ reply: reply });
        } else {
            return res.status(500).json({ error: data.error.message });
        }
    } catch (error) {
        return res.status(500).json({ error: 'サーバー内部でエラーが発生しました。' });
    }
}
