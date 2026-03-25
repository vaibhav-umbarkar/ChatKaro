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
                    junit allowEmptyResults: true, testResults: 'reports/test-results.xml'

                    archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
                }
            }
        }

        stage('Build') {
            steps {
                sh ''' 
                # Msg
                echo "Building artifact..."

                # Clean old build
                rm -rf build
                mkdir build

                # Copy required files
                cp app.js package.json package-lock.json build/
                cp -r css build/
                cp -r js build/
                cp index.html build/

                # Install production dependencies
                cd build
                npm ci --omit=dev --cache .npm-cache

                cd ..

                # Create compressed artifact
                tar -czf chatkaro-${BUILD_NUMBER}.tar.gz build
                '''
            }

            post {
                success {
                    archiveArtifacts artifacts: "chatkaro-${BUILD_NUMBER}.tar.gz", fingerprint: true
                }
            }
        }
    }
}