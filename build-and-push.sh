#!/usr/bin/env bash

AWS_REGION=eu-west-1
REG="340350203508.dkr.ecr.${AWS_REGION}.amazonaws.com"
REPO="tester/practicesoftwaretesting"
TAG="k8s-$(git rev-parse --short HEAD)"

aws ecr get-login-password --region "$AWS_REGION" \
 | docker login --username AWS --password-stdin "$REG"

# Build from repo root
docker build --no-cache -t $REG/$REPO:ui-$TAG   -f _docker/Dockerfile.ui   .
docker build --no-cache -t $REG/$REPO:api-$TAG  -f _docker/Dockerfile.api  .
docker build --no-cache -t $REG/$REPO:web-$TAG  -f _docker/Dockerfile.web  .
docker build --no-cache -t $REG/$REPO:cron-$TAG -f _docker/Dockerfile.cron .

# Push (single repo, component-prefixed tags)
for IMG in ui api web cron; do
  docker push $REG/$REPO:$IMG-$TAG
done