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
      subject: "Code de vérification",
      html: `<h2>Votre code de vérification est : ${code}</h2>`
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
