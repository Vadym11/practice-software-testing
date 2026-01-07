#!/usr/bin/env bash

namespace="$1"

if [ -z "$namespace" ]; then
    namespace="toolshop"
fi

set -e
echo creating ns $namespace...
kubectl create ns $namespace

echo applying secrets...
kubectl apply -f ./k8s/pst-db-secret.yaml -n $namespace
echo applying db manifest...
kubectl apply -f ./k8s/pst-db.yaml -n $namespace
echo applying api manifest...
kubectl apply -f ./k8s/pst-api.yaml -n $namespace
echo applying apiweb manifest...
kubectl apply -f ./k8s/pst-apiweb.yaml -n $namespace
echo applying web manifest...
kubectl apply -f ./k8s/pst-web.yaml -n $namespace
echo applying cron manifest...
kubectl apply -f ./k8s/pst-cron.yaml -n $namespace

kubectl rollout status deployment/pst-db  -n $namespace --timeout=120s || true
kubectl rollout status deployment/pst-api -n $namespace --timeout=180s
kubectl rollout status deployment/pst-web -n $namespace --timeout=180s
kubectl rollout status deployment/pst-apiweb -n $namespace --timeout=180s

kubectl run db-waiter --rm -i -n $namespace --image=busybox --restart=Never -- \
            sh -c 'until nc -z -w3 pst-db 3306; do echo "Waiting for DB..."; sleep 3; done'

kubectl exec -n $namespace deploy/pst-api -- \
            sh -c 'chmod -R 777 storage bootstrap/cache && php artisan migrate:fresh --seed --force --no-interaction'