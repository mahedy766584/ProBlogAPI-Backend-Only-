"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = async (to, resetLink) => {
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.default.smtp_host,
        port: Number(config_1.default.smtp_port),
        secure: config_1.default.NODE_DEV === 'production',
        auth: {
            user: config_1.default.smtp_host_mail,
            pass: config_1.default.smtp_pass,
        },
    });
    const emailBody = `
    <p>Hello,</p>
    <p>You requested a password reset. Click the button below to set a new password:</p>
    <a href="${resetLink}" style="padding:10px 15px; background-color:#F28069; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
    <p>This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
    <p>Thanks,<br/>The Blog Api Team</p>
    `;
    transporter.sendMail({
        from: config_1.default.smtp_host_mail,
        to,
        subject: "Reset Your Password - Action Required",
        text: `You requested to reset your password. Please click the link below to reset it. The link will expire in 10 minutes.`,
        html: emailBody
    });
};
exports.sendEmail = sendEmail;
