"use strict";

console.log(`region is: ${process.env.AWS_DEFAULT_REGION}`);

const xray = require("aws-xray-sdk");
const aws = require("aws-sdk");

const modified = xray.captureAWS(aws);
modified.config.update({ region: process.env.AWS_DEFAULT_REGION });
const sns = new modified.SNS();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const segment = new xray.Segment("job-runner");
const ns = xray.getNamespace();
ns.run(async () => {
  const { loadtest } = JSON.parse(process.env.COPILOT_SNS_TOPIC_ARNS);
  while (true) {
    console.log('setSegment');
    xray.setSegment(segment);
    try {
      const out = await sns
        .publish({
          Message: "test",
          TopicArn: loadtest,
        })
        .promise();

      console.log(`results: ${JSON.stringify(out)}`);
    } catch (err) {
      console.error(err);
    }
    segment.close();
    await sleep(50);
  }
});
