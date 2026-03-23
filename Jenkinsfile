pipeline {
    agent {
        docker {
            image: 'node:18'
        }

        stages {
            stage('Checkout') {
                steps {
                    checkout scm
                }
            }

            stage('Install dependency') {
                steps {
                    sh 'npm ci'
                }
            }

            stage('Test') {
                steps {
                    sh 'npm test'
                }
            }

            post {
                always {
                    junit 'reports/junit.xml'
                }
            }
        }
    }
}