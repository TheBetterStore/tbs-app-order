Environment=prod
DEPLOY_BUCKET=$MY_DEPLOY_BUCKET

APP_NAME=tbs-app-order
STACK_NAME=$APP_NAME-$Environment

sam build --cached

sam deploy --template-file .aws-sam/build/template.yaml --stack-name $STACK_NAME \
--s3-bucket $DEPLOY_BUCKET --s3-prefix $APP_NAME \
--capabilities CAPABILITY_NAMED_IAM --region ap-southeast-2 --parameter-overrides Environment=$Environment \
AppAdminCFName=tbs-app-admin-$Environment \
AppLoginCFName=tbs-app-login-$Environment \
InfraBaseCFName=tbs-infra-base-$Environment \
--no-fail-on-empty-changeset \
--tags Environment=$Environment StackName=$STACK_NAME TagProduct=$APP_NAME \
--profile thebetterstore
