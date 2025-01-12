# tbs-app-order

The Better Store's Order microservice implementation, using AWS SAM.

## Prerequisites (assuming Windows or Linux OS)
1. NodeJS 18+
2. AWS CLI 2.2.44+
3. AWS SAM
4. GitHub client
5. Favourite NodeJS IDE (e.g. Jetbrains Webstorm, Visual Studio Code)

Log into GitHub's NPM package manager via the following:
npm login --scope=@thebetterstore --auth-type=legacy --registry=https://npm.pkg.github.com
and enter your GitHub userid and classic Personal Access Token with read packages permissions when prompted. e.g. see:

https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages



## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 18](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

The SAM CLI installs dependencies defined in `package.json`, compiles TypeScript with esbuild, creates a deployment package, and saves it in the `.aws-sam/build` folder.

## Configure Stripe Webhooks for all PaymentIntent events
Refer to [Stripe webhook endpoints] (https://docs.stripe.com/webhooks); Note the following Stripe events that we wish to capture:
1. payment_intent.canceled. Occurs when a PaymentIntent is canceled. (yes, info only)
2. payment_intent.created. Occurs when a new PaymentIntent is created. (no)
3. payment_intent.partially_funded. Occurs when funds are applied to a customer_balance PaymentIntent and the 'amount_remaining' changes. (Yes, unexpected so alert)
4. payment_intent.payment_failed. Occurs when a PaymentIntent has failed the attempt to create a payment method or a payment.
5. payment_intent.processing. Occurs when a PaymentIntent has started processing. (no)
6. payment_intent.requires_action. Occurs when a PaymentIntent transitions to requires_action state. (Yes, unexpected so alert)
7. payment_intent.succeeded. Occurs when a PaymentIntent has successfully completed payment. (Yes, create event for fulfillment)

Our PaymentIntent webhook should be configured in Stripe as: https://api.thebetterstore.net/ocrder/v1/paymentevents (POST) 

```bash
tbs-app-order$ sam logs -n HelloWorldFunction --stack-name tbs-app-order --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `hello-world/tests` folder in this project. Use NPM to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
tbs-app-order$ cd tbs-app-order
hello-world$ npm install
hello-world$ npm run test
```

## Resources

1. [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.
2. [Stripe webhook endpoints] (https://docs.stripe.com/webhooks)

