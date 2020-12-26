const AWS = require('aws-sdk')
const S3 = new AWS.S3();
const SES = new AWS.SES();

let {
  DESTINATION: destinations,
  FROM: emailFrom,
  BUCKET_NAME: bucketName
} = process.env

module.exports.processEmails = async (event, context, callback) => {
  try {
    const mailEvent = event.Records[0].ses
    const { source } = mailEvent.mail

    // Spam filter
    if (mailEvent.receipt.spfVerdict.status === 'FAIL'
      || mailEvent.receipt.dkimVerdict.status === 'FAIL'
      || mailEvent.receipt.spamVerdict.status === 'FAIL'
      || mailEvent.receipt.virusVerdict.status === 'FAIL') {
      console.log('Dropping spam');
      // Stop processing rule set, dropping message
      callback(null, { 'disposition': 'STOP_RULE_SET' });
    } else {
      const { messageId } = mailEvent.mail

      // If destinations is not an array, we need to make it an arrat
      if (!Array.isArray(destinations)) {
        destinations = [destinations]
      }

      // Retrieve email information
      const data = await S3.getObject({
        Bucket: bucketName,
        Key: messageId
      }).promise();

      if (!([undefined, null].includes(data.Body))) {
        let emailData = data.Body.toString('utf-8')

        const realFrom = emailData.match(/^From:.*$/gm)
        if (Array.isArray(realFrom) && realFrom.length > 0) {
          emailData = emailData.replace(`${realFrom[0]}`, `From: ${emailFrom}`);
        }

        const returnPath = emailData.match(/^Return-Path:.*$/gm)
        if (Array.isArray(returnPath) && returnPath.length > 0) {
          emailData = emailData.replace(`${returnPath[0]}`, `Return-Path: ${emailFrom}`);
        }

        let subject = emailData.match(/^Subject:.*$/gm)
        if (Array.isArray(subject) && subject.length > 0) {
          emailData = emailData.replace(`${subject[0]}`, `${subject[0]} - ${source}`);
        }


        try {
          await SES.sendRawEmail({
            Destinations: destinations,
            RawMessage: {
              Data: emailData
            },
            Source: emailFrom
          }).promise();
        } catch (e) {
          console.error(e);
        }

        // Deleting processed Email.
        await S3.deleteObject({
          Bucket: bucketName,
          Key: messageId
        })
      } else {
        console.log(`No Body`)
      }
    }
    callback(null, null)
  } catch (error) {
    console.error(error.stack || error)
  }
}