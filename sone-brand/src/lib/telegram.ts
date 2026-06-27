export const sendTelegramMessage = async (message: string, chatId: string) => {
  const token = '8771684800:AAFNFH7fqq6cJpXP3vJwfk36Z1w9IkispgM';
  if (!chatId) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram Error:', err);
  }
};

export const getTelegramUpdates = async () => {
  const token = '8771684800:AAFNFH7fqq6cJpXP3vJwfk36Z1w9IkispgM';
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    return await res.json();
  } catch (err) {
    console.error('Telegram Updates Error:', err);
  }
};
