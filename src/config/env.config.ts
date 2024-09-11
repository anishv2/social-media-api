import dotenv from 'dotenv';
dotenv.config();

const AppConfig={
    port: process.env.SERVER_PORT!,
    corsOrigin: process.env.CORS_ORIGIN!,
    dbUri: process.env.DB_URI!,
    appName: process.env.APP_NAME!,
    salt: process.env.SALT!,
    accessTokenKey: process.env.ACCESS_TOKEN_SEC_KEY!,
    refreshTokenKey: process.env.REFRESH_TOKEN_SEC_KEY!,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY!,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY!,
    cloudinary: {
        apiKey: process.env.CLOUDINARY_API_KEY!,
        secretKey: process.env.CLOUDINARY_API_SEC_KEY!,
        name: process.env.CLOUDINARY_CLOUD_NAME!
    },
    mail: {
        senderName: process.env.MAIL_SENDER_NAME!,
        senderMail: process.env.MAIL_SENDER_EMAIL!,
        password: process.env.MAIL_PASSWORD!
    }

};

export default AppConfig;