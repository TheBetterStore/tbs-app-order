APP_NAME=tbs-app-order
STACK_NAME=$APP_NAME-$ENVIRONMENT

sam build --cached

CHANGESET_OPT=""
if [ "$REVIEW_CHANGESET" = "true" ]; then
  CHANGESET_OPT="--no-execute-changeset"
fi

sam deploy --template-file .aws-sam/build/template.yaml --stack-name $STACK_NAME \
--s3-bucket $DEPLOY_BUCKET --s3-prefix $APP_NAME \
--capabilities CAPABILITY_NAMED_IAM --region ap-southeast-2 --parameter-overrides Environment=$ENVIRONMENT \
AppAdminCFName=tbs-app-admin-$ENVIRONMENT \
AppLoginCFName=tbs-app-login-$ENVIRONMENT \
InfraBaseCFName=tbs-infra-$ENVIRONMENT \
--no-fail-on-empty-changeset $CHANGESET_OPT \
--tags Environment=$ENVIRONMENT StackName=$STACK_NAME TagProduct=$APP_NAME
