'use strict';

console.log(`region is: ${process.env.AWS_DEFAULT_REGION}`);

const AWSXRay = require('aws-xray-sdk');
const AWS = require('aws-sdk');

const AWSSdk = AWSXRay.captureAWS(AWS);
AWSSdk.config.update({region: process.env.AWS_DEFAULT_REGION});
const sns = new AWSSdk.SNS();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {
  const {loadtest} = JSON.parse(process.env.COPILOT_SNS_TOPIC_ARNS);
  while(true) {
      try {
          const out = await sns.publish({
            Message: 'test',
            TopicArn: loadtest,
          }).promise();
  
          console.log(`results: ${JSON.stringify(out)}`);
      } catch (err) {
          console.error(err);
      }
      await sleep(50);
  }
})();