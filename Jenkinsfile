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
                sh 'npm config set cache .npm-cache'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }

            post {
                always {
                    junit 'report/junit.xml'
                }
            }
        }
    }
}