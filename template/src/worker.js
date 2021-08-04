const amqp = require('amqplib/callback_api');

const listenerQueue = (queue = 'default', func = (msg, channel) => {channel.ack(msg);}) => {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue, {
                durable: true
            });
            channel.prefetch(1);
            console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
            channel.consume(queue, function(msg) {
                func(msg, channel)
            }, {
                noAck: false
            });
        });
    });
}

listenerQueue('process_queue', (msg, channel) => {
    console.log(" [x] Received %s", msg.content.toString());
    setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
    }, 2000);
});