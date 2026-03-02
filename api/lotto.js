export default async function handler(req, res) {
    const { drwNo } = req.query;
    const baseUrl = process.env.LOTTO_API_URL || 'https://www.dhlottery.co.kr/common.do';
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const response = await fetch(`${baseUrl}?method=getLottoNumber&drwNo=${drwNo}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '데이터를 불러오는 데 실패했습니다.' });
    }
}
