import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const verificationTemplatePath = path.join(
    process.cwd(),
    'templates',
    'verification.template.html'
);

const passwordResetTemplatePath = path.join(
    process.cwd(),
    'templates',
    'password-reset.template.html'
);

import {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    PORT,
} from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

export async function sendVerificationEmail(to, token) {
    const link = `http://localhost:${PORT}/api/auth/verify?token=${token}`;

    let verificationTemplate = fs.readFileSync(
        verificationTemplatePath,
        'utf8'
    );

    verificationTemplate = verificationTemplate
        .replace(/{{url}}/g, link)
        .replace(/{{name}}/g, to.split('@')[0]);

    await transporter.sendMail({
        from: EMAIL_USER,
        to,
        subject: 'Email doğrulama',
        html: verificationTemplate,
    });
}

export async function sendPasswordResetEmail(to, token) {
    const link = `http://localhost:${PORT}/api/auth/reset-password-confirmation?token=${token}`;
    let passwordResetTemplate = fs.readFileSync(
        passwordResetTemplatePath,
        'utf8'
    );
    passwordResetTemplate = passwordResetTemplate
        .replace(/{{url}}/g, link)
        .replace(/{{name}}/g, to.split('@')[0]);
    await transporter.sendMail({
        from: EMAIL_USER,
        to,
        subject: 'Şifre sıfırlama',
        html: passwordResetTemplate,
    });
}
