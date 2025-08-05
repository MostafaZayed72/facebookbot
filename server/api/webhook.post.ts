export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // تحقق من نوع الحدث
  if (body.object === 'page') {
    for (const entry of body.entry) {
      for (const messagingEvent of entry.messaging) {
        const senderId = messagingEvent.sender.id;

        // لو رسالة عادية من المستخدم
        if (messagingEvent.message && messagingEvent.message.text) {
          await sendMessage(senderId, "مرحباً 👋 شكراً لتواصلك معنا! 🌟");
        }
      }
    }
    return { status: 'EVENT_RECEIVED' };
  }

  return { status: 'NOT_HANDLED' };
});

// دالة إرسال رسالة
async function sendMessage(recipientId: string, messageText: string) {
  const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;

  await $fetch(`https://graph.facebook.com/v23.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    body: {
      recipient: { id: recipientId },
      message: { text: messageText }
    }
  });
}
