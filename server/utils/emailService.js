const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Générer un code à 6 chiffres
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, code) => {
  try {
    await resend.emails.send({
      from: "Agence Voursa <contact@agencevoursa.com>",
      to: email,
      subject: "Voursa - رمز التحقق",
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc; padding: 20px; text-align: right;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Agence Voursa</h1>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a202c; margin-top: 0; margin-bottom: 20px; font-size: 24px;">مرحباً بك في وكالة فرصة! 👋</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                شكراً لتسجيلك معنا. نحن سعداء بانضمامك إلينا.<br>
                لإكمال عملية إنشاء حسابك وتأكيد بريدك الإلكتروني، يرجى استخدام رمز التحقق أدناه:
              </p>

              <!-- Code Box -->
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">${code}</span>
              </div>

              <p style="color: #718096; font-size: 14px; margin-bottom: 10px;">
                ⏳ هذا الرمز صالح لمدة 10 دقائق فقط.
              </p>
              
              <p style="color: #718096; font-size: 14px; margin-bottom: 30px;">
                إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.
              </p>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

              <p style="color: #4a5568; font-size: 16px; font-weight: bold; margin: 0;">
                مع تحيات فريق وكالة فرصة 🏠
              </p>
              <p style="color: #718096; font-size: 14px; margin-top: 5px;">
                <a href="https://agencevoursa.com" style="color: #4f46e5; text-decoration: none;">www.agencevoursa.com</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © 2025 Agence Voursa. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log("✅ Email envoyé avec Resend");

  } catch (error) {
    console.error("❌ Erreur Resend :", error);
    throw error;
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
};
