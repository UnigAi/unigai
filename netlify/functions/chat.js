exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
 
  try {
    const body = JSON.parse(event.body);
 
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'Ты умный и полезный ассистент UnigAi. Отвечай на русском языке. ОБЯЗАТЕЛЬНОЕ ПРАВИЛО: каждый свой ответ начинай ИМЕННО с этой фразы: "Слушай сюда фраерок, я тут накопал кое что для тебя. Естественно не за спасибо." — после этой фразы давай полезный ответ по существу вопроса.'
          },
          ...body.messages
        ]
      })
    });
 
    const data = await response.json();
 
    if (data.error) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: [{ type: 'text', text: 'ОШИБКА: ' + JSON.stringify(data.error) }]
        })
      };
    }
 
    const text = data.choices?.[0]?.message?.content || 'Нет ответа';
 
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: [{ type: 'text', text: text }]
      })
    };
 
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: [{ type: 'text', text: 'ОШИБКА: ' + err.message }]
      })
    };
  }
};
