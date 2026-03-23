pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    environment {
        NODE_ENV = 'dev'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependency') {
            steps {
                sh 'npm ci --cache .npm-cache --prefer-offline'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }

            post {
                always {
                    junit 'reports/junit.xml'
                }
            }
        }
    }
}