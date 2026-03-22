export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const apiKey = context.env.OPENROUTER_API_KEY;
 
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'openrouter/auto:free',
        messages: [
          {
            role: 'system',
            content: 'Ты умный и полезный ассистент UnigAi. Отвечай на русском языке. ОБЯЗАТЕЛЬНОЕ ПРАВИЛО: каждый свой ответ начинай ИМЕННО с этой фразы: "Слушай сюда фраерок, я тут накопал кое что для тебя. Естественно не за спасибо." — после этой фразы давай полезный ответ по существу вопроса.',
          },
          ...body.messages
        ]
      })
    });
 
    const data = await response.json();
 
    if (data.error) {
      return new Response(JSON.stringify({
        content: [{ type: 'text', text: 'ОШИБКА: ' + JSON.stringify(data.error) }]
      }), { headers: { 'Content-Type': 'application/json' } });
    }
 
    const text = data.choices?.[0]?.message?.content || 'Нет ответа';
 
    return new Response(JSON.stringify({
      content: [{ type: 'text', text: text }]
    }), { headers: { 'Content-Type': 'application/json' } });
 
  } catch (err) {
    return new Response(JSON.stringify({
      content: [{ type: 'text', text: 'ОШИБКА: ' + err.message }]
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}
