
export default async function handler(req, res) {
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { mood } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'APIキーが設定されていません。' });
    }

    //const url = `https://googleapis.com{apiKey}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const promptText = `私は今【${mood}】という気分です。この気分にぴったりな、元気が出る一言メッセージか、おすすめの過ごし方を50文字程度で優しく提案してください。`;

    console.log(url);
    console.log(promptText);
    
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
        // 💡 修正ポイント：[0] を追加して、オプショナルチェーニング（?.）で安全に取得する
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reply) {
            return res.status(200).json({ reply: reply });
        } else {
            console.error("Geminiのレスポンス構造が想定外です:", JSON.stringify(data));
            return res.status(500).json({ error: 'AIからの返答データが空でした。' });
        }
            
    } else {
        // Gemini API側からエラー（キーが無効など）が返ってきた場合
        console.error("Gemini API エラー詳細:", JSON.stringify(data));
        return res.status(500).json({ error: data.error?.message || 'Gemini APIでエラーが発生しました。' });
    }
        //if (response.ok) {
        //    const reply = data.candidates.content.parts.text;
        //    return res.status(200).json({ reply: reply });
        //} else {
        //    return res.status(500).json({ error: data.error.message });
        //}
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'サーバー内部でエラーが発生しました。' });
    }
}
