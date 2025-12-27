const nodemailer = require('nodemailer');

/**
 * Create Email Transporter
 * إنشاء ناقل البريد الإلكتروني
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send Email
 * إرسال بريد إلكتروني
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Taskman" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('فشل إرسال البريد الإلكتروني');
  }
};

/**
 * Send Password Reset Email
 * إرسال بريد إعادة تعيين كلمة المرور
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    مرحباً ${userName || 'عزيزي المستخدم'}،
    
    لقد طلبت إعادة تعيين كلمة المرور الخاصة بحسابك.
    
    يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:
    ${resetURL}
    
    هذا الرابط صالح لمدة ساعة واحدة فقط.
    
    إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.
    
    مع تحيات فريق Taskman
  `;

  const htmlMessage = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إعادة تعيين كلمة المرور</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .header {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #2980b9;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #7f8c8d;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="header">إعادة تعيين كلمة المرور</h1>
        <p>مرحباً ${userName || 'عزيزي المستخدم'}،</p>
        <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بحسابك.</p>
        <p>يرجى النقر على الزر التالي لإعادة تعيين كلمة المرور:</p>
        <div style="text-align: center;">
          <a href="${resetURL}" class="button">إعادة تعيين كلمة المرور</a>
        </div>
        <p>أو يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
        <p style="word-break: break-all; color: #3498db;">${resetURL}</p>
        <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
        <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.</p>
        <div class="footer">
          <p>مع تحيات فريق Taskman</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email,
    subject: 'إعادة تعيين كلمة المرور - Taskman',
    message,
    html: htmlMessage,
  });
};

/**
 * Send Welcome Email
 * إرسال بريد ترحيبي
 */
const sendWelcomeEmail = async (email, userName) => {
  const message = `
    مرحباً ${userName}،
    
    أهلاً بك في نظام Taskman لإدارة المهام!
    
    تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول والبدء في إدارة مهامك.
    
    مع تحيات فريق Taskman
  `;

  return sendEmail({
    email,
    subject: 'مرحباً بك في Taskman',
    message,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};

