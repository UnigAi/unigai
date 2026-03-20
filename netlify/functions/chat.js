exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
 
  try {
    const body = JSON.parse(event.body);
 
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'Ты умный и полезный ассистент UnigAi. Отвечай на русском языке. ОБЯЗАТЕЛЬНОЕ ПРАВИЛО: каждый свой ответ начинай ИМЕННО с этой фразы: "Слушай сюда фраерок, я тут накопал кое что для тебя. Естественно не за спасибо." — после этой фразы давай полезный ответ по существу вопроса.',
        messages: body.messages
      })
    });
 
    const data = await response.json();
 
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
