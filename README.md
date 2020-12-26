## Serverless Email Forwarder

This is a simple implementation zero code needed for an email forwarder using Serverless, AWS SES.


## Config

> Note: create a JSON file with the stage name at config folder [e.g. prod.json]

```JSON
{
    "BUCKET_NAME": "fowarder-emails", // Bucket name {BUCKET_NAME}-{STAGE}
    "EMAIL_RECIPIENTS": [   // Email list to listen incoming messages
        "me@andresmorelos.dev"
    ],
    "DESTINATION": [  // Destination email list 
        "name@domain.tdl"
    ],
    "SENDER": "name@domain.tdl" // Verified email that will send the email.
}
```

## Deploy the stack

```sh
    npm install
    serverless deploy --stage [DEV/TEST/PROD/STAGE_NAME]
```

or

```sh
    npm i
    sls deploy --stage [DEV/TEST/PROD/STAGE_NAME]
```

## Limitations

1. A domain verify at AWS SES service first is needed. 
2. A sender email verify at AWS SES service first is needed.

### How to verify my domain?

> See [https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html)

### How to verify my email?

> See [https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html)