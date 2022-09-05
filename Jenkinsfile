pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '3', artifactNumToKeepStr: '3'))
    }

    stages {


        stage("Notify Job Start"){
            environment {
               GIT_LOG = sh(script: 'git log --pretty=format:"%cn :  %s"   ${GIT_PREVIOUS_SUCCESSFUL_COMMIT}..HEAD', , returnStdout: true).trim()
            }
            steps {
                slackNotification('STARTED_JOB : '+ JOB_NAME +"  "+JOB_URL)
                slackNotification('COMMIT_LIST : \n'+ env.GIT_LOG)
            }
        } 

        stage('Build App & Container Image') {

            steps{
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'docker build -t liveui/liveui-website:latest .'

            }
        }


        stage ('NPM Scan') {
            steps {            
                    
                    sh 'npm run generate-audit-report'
  
            }
            post {
                always {
                    archiveArtifacts artifacts: 'npm-report.html', fingerprint: true
                }
            }  
        }

        stage('Image Scan') {
        
            agent {
                    docker { 
                        image 'aquasec/trivy'
                        args '-u root -v /var/run/docker.sock:/var/run/docker.sock -v trivy_cache:/cache    --entrypoint= '
                    }
            }
            steps {

                sh 'trivy   --cache-dir /cache -f json -o trivy-results.json  liveui/liveui-website'
                sh 'cat trivy-results.json'

            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-results.json', fingerprint: true
                }
            }        
        }     

        stage('Login GCR') {
	      steps{
	          withCredentials([string(credentialsId: 'eteration-gcr-docker-login-key', variable: 'GCR_IO_CREDENTIALS')]) {
	              sh 'docker login -u _json_key -p "${GCR_IO_CREDENTIALS}" https://gcr.io'
	          }
	      }
	    }



        stage ('Image Push') {
            steps {
                sh 'docker tag liveui/liveui-website:latest gcr.io/eteration/liveui/liveui-website:latest'
                sh 'docker push gcr.io/eteration/liveui/liveui-website:latest'
            }
        }
        
        stage('Deploy') {
                agent {
                        docker { 
                                image 'gcr.io/eteration/cnf/kubectl-runner:latest'
                                args '-t'
                                }
                }
                steps {

                    withKubeConfig([credentialsId: 'common-west.k8s.eteration.com',
                                    serverUrl: 'https://api.common-west.k8s.eteration.com',
                                    clusterName: 'common-west.k8s.eteration.com',
                                    namespace: 'liveui'
                                    ]) {
                         sh "kubectl apply -f ./platform/k8s/"
                         sh './patch.sh'

                    
                    }

                }
        }

        
   


    }

    post{
            always {
                    echo "Pipeline result: ${currentBuild.result}"
                    script {
                            slackNotification("FINISHED_JOB : "+env.JOB_NAME  +" :"+  currentBuild.result + " "+ JOB_DISPlAY_URL )
                    }
            }
    }
}

def slackNotification(String msg) {
    withCredentials([string(credentialsId: 'slack_token', variable: 'slack_token')]) {
            
            def payload = groovy.json.JsonOutput.toJson([
                text: msg,
                channel: "#secops",
                username: "jenkins",
                icon_emoji:":bowtie:"
            ])
            sh "curl -X POST -H 'Content-type: application/json' --data \'${payload}\' https://hooks.slack.com/services/T223TGSTS/${slack_token}"

    }  
}
