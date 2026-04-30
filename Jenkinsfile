pipeline {
    agent any

    stages {
        stage('Deploy Green') {
            steps {
                sh 'kubectl apply -f green-deployment.yaml'
            }
        }

        stage('Switch Traffic') {
            steps {
                sh '''
                kubectl patch service app-service \
                -p '{"spec":{"selector":{"app":"myapp","version":"green"}}}'
                '''
            }
        }

        stage('Remove Blue') {
            steps {
                sh 'kubectl delete deployment app-blue'
            }
        }
    }
}