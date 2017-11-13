# dropbox_mongodb_kafka

In order to execute the project following steps needs to followed.
1) In Topics.sh file provide path to your Zookeeper directory
2) In Topics.sh file provide path to your Kafka directory
3) Execute the Topics.sh either on terminal by sending command sh Topics.sh or by clicking on it
4) After successful executiion all the required topics to run dropbox application will be available
5) Start Kafka Server: bin/kafka-server-start.sh config/server.properties
6) Start MongoDB Server: mongod (if path for mongod is specified in path on system else set path and run mongod)
7) Then run dropbox_Client, dropbox_kafka_frontend, dropbox_kafka_backend
8) Now, you are good to create your account and perform dropbox like features on this application
