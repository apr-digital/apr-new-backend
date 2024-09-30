pipeline {
    agent any

    stages {
        stage('Stop and Down Existing Docker Containers') {
            steps {
                sh 'docker compose down'
            }
        }

        stage('Remove all Containers,Images and Volumes') {
            steps {
                sh 'pwd'
                sh 'docker system prune  --all --force --volumes'
            }
        }
        stage('Debug') {
           steps {
              sh 'pwd'
              sh 'whoami'
            }
       }

         stage('Fetch and Pull updated code from GIT') {
            steps {
              sh 'git pull origin apr_stage_01'
            }
          
        }

        stage('Recreate Containers,Images and Volumes') {
            steps {
                sh 'pwd'
                sh 'docker compose up -d'
               
            }
        }
    }
}






