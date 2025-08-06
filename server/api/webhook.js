export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // ✅ التحقق من Webhook
  if (event.node.req.method === 'GET') {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode && token === process.env.VERIFY_TOKEN) {
      return challenge;
    } else {
      return 'Verification failed';
    }
  }

  // ✅ استقبال الرسائل من فيسبوك
  if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    console.log('📩 رسالة جديدة:', JSON.stringify(body, null, 2));

    // الرد التلقائي (مثال بسيط)
    if (body.object === 'page') {
      body.entry.forEach((entry) => {
        const webhookEvent = entry.messaging[0];
        const senderId = webhookEvent.sender.id;

        // إرسال رد
        sendMessage(senderId, 'شكرًا لرسالتك! 🚀');
      });
    }

    return 'EVENT_RECEIVED';
  }

  return 'Method not supported';
});

// ✅ دالة إرسال رسالة
async function sendMessage(recipientId, messageText) {
  const url = `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

  await $fetch(url, {
    method: 'POST',
    body: {
      recipient: { id: recipientId },
      message: { text: messageText },
    },
  });
}
