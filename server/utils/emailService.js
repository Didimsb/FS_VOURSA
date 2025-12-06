const nodemailer = require('nodemailer');

// Créer le transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Générer un code à 6 chiffres
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Envoyer l'email de vérification
const sendVerificationEmail = async (email, code) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Voursa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'رمز التحقق من حسابك - Voursa',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Voursa</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">رمز التحقق الخاص بك</h2>
          <p style="color: #666; text-align: center; font-size: 16px;">
            مرحباً بك في Voursa! استخدم الرمز التالي لتأكيد تسجيلك:
          </p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${code}</span>
          </div>
          <p style="color: #999; text-align: center; font-size: 14px;">
            هذا الرمز صالح لمدة 10 دقائق فقط.
          </p>
          <p style="color: #999; text-align: center; font-size: 14px;">
            إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.
          </p>
        </div>
        <p style="color: #999; text-align: center; font-size: 12px; margin-top: 20px;">
          © 2025 Voursa. جميع الحقوق محفوظة.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
};
