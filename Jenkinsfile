pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/snkalt/notepad-backend, branch: 'main'
            }
        }
        stage('Build & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                // Add your deployment steps here
            }
        }
    }
}

