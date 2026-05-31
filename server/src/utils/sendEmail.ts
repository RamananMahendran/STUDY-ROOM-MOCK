import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// ── Build a transporter ──────────────────────────────────────────────────────
// In development  → Automatically spins up an Ethereal fake-SMTP account.
//                   Every sent email is captured; a preview URL is logged.
// In production   → Uses the SMTP_* env vars set in your hosting platform.
// ────────────────────────────────────────────────────────────────────────────
async function createTransporter() {
  if (process.env.NODE_ENV !== 'production') {
    // Generate a one-time test account on Ethereal (no sign-up needed)
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // ── Production SMTP (configure via env vars) ──────────────────────────────
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      'Missing production email configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in your .env file.'
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Main sendEmail function ──────────────────────────────────────────────────
const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = await createTransporter();

  const fromName = process.env.EMAIL_FROM_NAME || 'Study Room';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'noreply@studyroom.dev';

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  // In development, log the Ethereal preview URL so you can open the email
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n📧 [DEV] Email captured by Ethereal (fake SMTP)');
    console.log(`   To      : ${options.to}`);
    console.log(`   Subject : ${options.subject}`);
    console.log(`   Preview : ${nodemailer.getTestMessageUrl(info)}`);
    console.log('   ↑ Open this URL in your browser to see the email.\n');
  }
};

export default sendEmail;
