# Blue-Green Deployment Demo

This project demonstrates blue-green deployment with Jenkins, Docker, and Kubernetes.

## Build and push images

```bash
docker build -t ayush277/app:blue .
docker push ayush277/app:blue

docker build -t ayush277/app:green .
docker push ayush277/app:green
```

## Deploy blue first

```bash
kubectl apply -f blue-deployment.yaml
kubectl apply -f service.yaml
minikube service app-service
```

## Deploy green and switch traffic

```bash
kubectl apply -f green-deployment.yaml
kubectl patch service app-service -p '{"spec":{"selector":{"app":"myapp","version":"green"}}}'
```

## Roll back to blue

```bash
kubectl patch service app-service -p '{"spec":{"selector":{"app":"myapp","version":"blue"}}}'
```

## DevSecOps additions

This repo includes example artifacts to demonstrate security checks added into the pipeline.

- `Jenkinsfile.devsecops` — example pipeline with SonarQube, Dependency-Check, Trivy image scan, image push and blue/green deploy.
- `sonar-project.properties` — sonar-scanner configuration (set `sonar.login` token in CI environment).
- `secret-example.yaml` — demo Kubernetes Secret (do not store real secrets in Git).
- `rbac.yaml` — sample Role & RoleBinding demonstrating RBAC restrictions.
- `networkpolicy.yaml` — example NetworkPolicy allowing only same-namespace traffic to app pods.
- `ingress-tls.yaml` — example Ingress manifest configured for TLS (needs ingress controller and TLS secret).

Recommended local steps to try DevSecOps scans (install required tools first):

1. Start SonarQube (local dev):

```bash
docker run -d -p 9000:9000 --name sonarqube sonarqube
# Open http://localhost:9000 and configure a token, then set SONAR_TOKEN in Jenkins
```

2. Run OWASP Dependency-Check locally:

```bash
# Install dependency-check (e.g. via brew)
dependency-check --scan . --format ALL
```

3. Scan image with Trivy:

```bash
trivy image ayush277/app:v1
```

4. Create demo Kubernetes secret (for local demo only):

```bash
kubectl apply -f secret-example.yaml
```

5. Apply RBAC/NetworkPolicy manifests to demo cluster as needed:

```bash
kubectl apply -f rbac.yaml
kubectl apply -f networkpolicy.yaml
```

Notes:
- Replace `ayush277/app:v1` with your CI-produced image tag in `Jenkinsfile.devsecops` or configure environment variables in Jenkins.
- For production, use a proper secrets manager (Vault, AWS Secrets Manager, Azure Key Vault) and avoid committing secrets to Git.
- To enable HTTPS, deploy an ingress controller (e.g., nginx-ingress) and create a TLS secret containing cert/key, then apply `ingress-tls.yaml`.
