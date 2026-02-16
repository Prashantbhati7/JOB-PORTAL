import { Kafka } from "kafkajs";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const startSendMailConsumer = async () => {
    try {
        console.log("BROKER VALUE:", process.env.KAFKA_BROKER);
        const kafka = new Kafka({
            clientId: 'mail-service',
            brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
        });
        const consumer = kafka.consumer({ groupId: 'mail-service-group' });
        await consumer.connect();
        const topicName = "send-mail"; // message will come with this name 
        await consumer.subscribe({ topic: topicName, fromBeginning: false });
        console.log("Mail service consumer started listening for sending mail ");
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { to, subject, html } = JSON.parse(message.value?.toString() || "{}");
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "prashantbhati774@gmail.com",
                            pass: "lydpwhkbulxszfhj"
                        }
                    });
                    await transporter.sendMail({
                        from: "EzHire <no-reply>",
                        to,
                        subject,
                        html
                    });
                    console.log("mail has been sent to ", to);
                }
                catch (error) {
                    console.log("Failed to send Mail :  ", error);
                }
            }
        });
    }
    catch (error) {
        console.log("Failed to Start Kafka : ", error);
    }
};
export default startSendMailConsumer;
