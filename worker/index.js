const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const client = new SQSClient({ region: "us-west-2" });

console.log(`COPILOT_QUEUE_URI: ${process.env.COPILOT_QUEUE_URI}`);
console.log(`COPILOT_TOPIC_QUEUE_URIS: ${process.env.COPILOT_TOPIC_QUEUE_URIS}`);
console.log("bump 4");
const eventsQueue = process.env.COPILOT_QUEUE_URI;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log(`The queue url created is: ${eventsQueue}`);
    while(true) {
        try {
            const out = await client.send(new ReceiveMessageCommand({
                QueueUrl: eventsQueue,
                WaitTimeSeconds: 10,
            }));
    
            console.log(`results: ${JSON.stringify(out)}`);
    
            if (out.Messages === undefined || out.Messages.length === 0) {
                await sleep(300);
                continue;
            }
            await sleep(300);
    
            await client.send( new DeleteMessageCommand({
                QueueUrl: eventsQueue,
                ReceiptHandle: out.Messages[0].ReceiptHandle,
            }));
        } catch (err) {
            console.error(err);
        }
    }
})();
