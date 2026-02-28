import { Kafka } from "kafkajs";
import ApiError from "./utils/ApiError.js";
import dotenv from 'dotenv';
dotenv.config();
let producer;
let admin;
export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'auth-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
        });
        admin = kafka.admin();
        await admin.connect();
        const topic = await admin.listTopics();
        if (!topic.includes("send-mail")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-mail",
                        numPartitions: 1,
                        replicationFactor: 1,
                    },
                ],
            });
            console.log("Topic 'send-mail' created successfully");
        }
        await admin.disconnect();
        producer = kafka.producer();
        await producer.connect();
        console.log("Kafka connected successfully");
        return producer;
    }
    catch (error) {
        console.log("Failed to connect Kafka: ", error);
        throw new ApiError(404, "Kafka not connected");
    }
};
export const PublishToTopic = async (topic, message) => {
    if (!producer) {
        console.log("Kafka Producer is not Initialized  ");
        throw new ApiError(404, "Kafka Producer is not Initialized");
    }
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }]
        });
    }
    catch (error) {
        console.log('Failed to publish message to Kafka : ', error);
    }
};
export const disconnectKafka = async () => {
    try {
        if (producer) {
            await producer.disconnect();
        }
    }
    catch (error) {
        console.log("Failed to disconnect Kafka : ", error);
    }
};
