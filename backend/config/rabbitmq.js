const amqp = require("amqplib");

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");

  channel = await connection.createChannel();

  await channel.assertQueue("signals", {
    durable: true, // survives restart
  });
}

function sendToQueue(data) {
  channel.sendToQueue(
    "signals",
    Buffer.from(JSON.stringify(data)),
    { persistent: true } // ensures reliability
  );
}

module.exports = { connectQueue, sendToQueue };
