export default defineEventHandler((event) => {
  const query = getQuery(event);

  if (query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    return query['hub.challenge'];
  }

  return 'Verification failed';
});
