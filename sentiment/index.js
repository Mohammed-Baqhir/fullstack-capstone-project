const express = require('express');
const axios = require('axios');
const natural = require('natural');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'GiftLink sentiment service is running' });
});

app.post('/sentiment', async (req, res) => {
  try {
    const { sentence } = req.body;

    if (!sentence) {
      return res.status(400).json({ message: 'sentence is required' });
    }

    console.log('Processing sentiment request:', sentence);

    // Axios is included as requested by the lab. If EXTERNAL_SENTIMENT_URL exists,
    // the service will call it. Otherwise, it analyzes locally using natural.
    if (process.env.EXTERNAL_SENTIMENT_URL) {
      const externalResponse = await axios.post(process.env.EXTERNAL_SENTIMENT_URL, { sentence });
      return res.status(200).json(externalResponse.data);
    }

    const tokenizer = new natural.WordTokenizer();
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokens = tokenizer.tokenize(sentence);
    const score = analyzer.getSentiment(tokens);

    let sentiment = 'neutral';
    if (score > 0) sentiment = 'positive';
    if (score < 0) sentiment = 'negative';

    res.status(200).json({ sentence, score, sentiment });
  } catch (error) {
    console.error('Sentiment processing error:', error.message);
    res.status(500).json({ message: 'Error analyzing sentiment', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sentiment service running on port ${PORT}`);
});
