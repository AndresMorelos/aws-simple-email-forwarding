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