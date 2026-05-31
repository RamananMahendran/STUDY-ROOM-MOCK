import User from './User.js';
import generateToken from './generateToken.js';
import sendEmail from '../../utils/sendEmail.js';
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const emailExists = await User.findByEmail(email);
        const usernameExists = await User.findByUsername(username);
        if (emailExists || usernameExists) {
            res.status(400);
            throw new Error('User already exists (email or username taken)');
        }
        const user = await User.create({
            username,
            email,
            password,
        });
        if (user) {
            const token = generateToken(res, user.id);
            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                streak: user.streak,
                token,
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (user && (await User.matchPassword(password, user.password))) {
            const token = generateToken(res, user.id);
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                streak: user.streak,
                token,
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401);
            throw new Error('Not authorized, session identifier reference is missing');
        }
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                streak: user.streak,
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Send password-reset email
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400);
            throw new Error('Please provide an email address.');
        }
        const user = await User.findByEmail(email);
        // Security: always return the same response regardless of whether the user exists
        // (prevents account enumeration attacks)
        if (!user) {
            res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a reset link has been sent.',
            });
            return;
        }
        // Generate plain token, save hashed version to DB
        const plainToken = await User.saveResetToken(user.id);
        // Build the reset URL (frontend route)
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${plainToken}`;
        // Beautiful HTML email template
        const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset your Study Room password</title>
      </head>
      <body style="margin:0;padding:0;background:#0f0f16;font-family:'Inter',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f16;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#14141c;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
                <!-- Header bar -->
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);height:4px;"></td>
                </tr>
                <!-- Logo + Brand -->
                <tr>
                  <td style="padding:32px 40px 0;text-align:center;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.3px;">📚 Study Room</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:24px 40px 32px;">
                    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Reset your password</h1>
                    <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
                      Hi <strong style="color:#c4b5fd;">${user.username}</strong>, we received a request to reset the password for your Study Room account.
                      Click the button below to choose a new one.
                    </p>
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;padding:1px;">
                          <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;font-size:15px;font-weight:700;border-radius:11px;letter-spacing:0.1px;">
                            Reset my password →
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!-- Security note -->
                    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
                      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#6366f1;">Security notice</p>
                      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                        This link expires in <strong style="color:#9ca3af;">10 minutes</strong>.
                        If you didn't request a password reset, you can safely ignore this email — your account is secure.
                      </p>
                    </div>
                    <!-- Fallback URL -->
                    <p style="margin:20px 0 0;font-size:12px;color:#4b5563;line-height:1.6;">
                      If the button doesn't work, paste this link into your browser:<br/>
                      <a href="${resetUrl}" style="color:#6366f1;word-break:break-all;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:16px 40px 24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="margin:0;font-size:12px;color:#374151;">© ${new Date().getFullYear()} Study Room · Made with ❤️ by students in India</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        await sendEmail({
            to: user.email,
            subject: '🔐 Reset your Study Room password',
            html: emailHtml,
        });
        res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a reset link has been sent.',
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Reset password using the token from the email link
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const resetToken = req.params['resetToken'];
        const { password } = req.body;
        // ── Validate input ──────────────────────────────────────────────────────
        if (!password) {
            res.status(400);
            throw new Error('Please provide a new password.');
        }
        if (password.length < 8) {
            res.status(400);
            throw new Error('Password must be at least 8 characters long.');
        }
        // ── Find user by the hashed token (also checks expiry) ─────────────────
        const user = await User.findByResetToken(resetToken);
        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired reset token. Please request a new password reset link.');
        }
        // ── Update password & clear token ───────────────────────────────────────
        await User.updatePassword(user.id, password);
        await User.clearResetToken(user.id);
        // ── Auto-login: return a new JWT so the user lands logged in ────────────
        const token = generateToken(res, user.id);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully.',
            id: user.id,
            username: user.username,
            email: user.email,
            streak: user.streak,
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
