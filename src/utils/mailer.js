// src/utils/mailer.js - Real Email Delivery Service for K-Sync Malaysia
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

// Initialize or return nodemailer transporter
async function getTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE
  } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    // Real SMTP server (Hostinger, Gmail, SendGrid, etc.)
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER.trim(),
        pass: SMTP_PASS.replace(/\s+/g, '')
      },
      tls: {
        rejectUnauthorized: false
      },
      allowInternalNetworkInterfaces: true,
      dnsTimeout: 5000
    });
    console.log(`[Email Service] Configured live SMTP transport via ${SMTP_HOST}:${SMTP_PORT || 587} (${SMTP_USER})`);
  } else {
    // Fallback: Test account (Ethereal Email) or mock transport
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('[Email Service] Live SMTP credentials not found in .env; using temporary test account for delivery.');
    } catch (e) {
      console.warn('[Email Service] Could not create test account, fallback to console logger only:', e.message);
      transporter = {
        sendMail: async (opts) => {
          console.log(`[Email Service Mock] Delivered to: ${opts.to} | Subject: ${opts.subject}`);
          return { messageId: 'mock-' + Date.now() };
        }
      };
    }
  }

  return transporter;
}

// Generate standard email styling header/footer
function getEmailTemplate(contentHtml) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-Sync Malaysia</title>
    <style>
      body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6; }
      .container { max-width: 600px; margin: 20px auto; background-color: #111827; border-radius: 16px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .header { background: linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #1e1b4b 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #ec4899; }
      .brand-title { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
      .brand-title span { color: #ec4899; }
      .tagline { color: #9ca3af; font-size: 13px; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; }
      .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #d1d5db; }
      .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
      .badge-pending { background-color: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
      .badge-verified { background-color: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
      .badge-rejected { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
      .code-card { background-color: #1f2937; border: 1px dashed #ec4899; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
      .code-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 4px; }
      .code-value { font-size: 28px; font-weight: 800; color: #ec4899; letter-spacing: 2px; font-family: 'Courier New', Courier, monospace; }
      .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a2234; border-radius: 8px; overflow: hidden; }
      .details-table td { padding: 12px 16px; border-bottom: 1px solid #28334e; font-size: 14px; }
      .details-table tr:last-child td { border-bottom: none; }
      .details-label { color: #9ca3af; width: 35%; font-weight: 600; }
      .details-val { color: #ffffff; font-weight: 500; }
      .button-wrapper { text-align: center; margin: 30px 0 16px; }
      .btn { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); }
      .footer { background-color: #0d131f; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937; }
      .footer a { color: #ec4899; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="brand-title">K-SYNC <span>MALAYSIA</span></h1>
        <div class="tagline">Centralized K-Pop Event & Fan Community Platform</div>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} K-Sync Malaysia. All rights reserved.</p>
        <p>This is an automated notification for event organizers & submitters.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Standardized Sender Address Helper
 */
export function getFromAddress() {
  const user = (process.env.SMTP_USER || 'noreply@ksync.my').trim();
  return process.env.EMAIL_FROM || process.env.SMTP_FROM || `"noreply" <${user}>`;
}

// 1. Send Submission Confirmation Email (UC20)
export async function sendSubmissionConfirmationEmail({
  to,
  name,
  eventName,
  eventDate,
  venueName,
  trackingCode
}) {
  try {
    const client = await getTransporter();
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:8000';
    const trackingLink = `${appBaseUrl}/check-submission?code=${encodeURIComponent(trackingCode)}`;
    const fromAddress = getFromAddress();

    const htmlContent = `
      <div style="text-align: center;">
        <span class="badge badge-pending">Submission Received & Pending Review</span>
        <h2 style="color: #ffffff; margin-top: 8px; font-size: 22px;">Hi ${name || 'Event Organizer'},</h2>
        <p style="color: #9ca3af; margin-bottom: 20px;">Thank you for submitting your K-Pop event to K-Sync Malaysia! We have received your submission details.</p>
      </div>

      <div class="code-card">
        <div class="code-label">Your Unique Reference Tracking Code</div>
        <div class="code-value">${trackingCode}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Keep this code safe to check your verification status or make edits if requested.</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="details-label">Event Name</td>
          <td class="details-val">${eventName}</td>
        </tr>
        <tr>
          <td class="details-label">Event Date</td>
          <td class="details-val">${eventDate}</td>
        </tr>
        <tr>
          <td class="details-label">Venue / Location</td>
          <td class="details-val">${venueName}</td>
        </tr>
        <tr>
          <td class="details-label">Review Status</td>
          <td class="details-val" style="color: #fbbf24; font-weight: 700;">Pending Verification</td>
        </tr>
      </table>

      <p style="color: #d1d5db; font-size: 14px;">Our administration team reviews all submissions to verify official event announcements, schedule accuracy, and authenticity before publishing. You will receive another email as soon as your event is approved.</p>

      <div class="button-wrapper">
        <a href="${trackingLink}" class="btn">Track Submission Online →</a>
      </div>
      
      <p style="font-size: 12px; color: #6b7280; text-align: center;">Direct link: <a href="${trackingLink}" style="color: #ec4899;">${trackingLink}</a></p>
    `;

    const info = await client.sendMail({
      from: fromAddress,
      to,
      subject: `[K-Sync Malaysia] Event Submission Received: ${eventName} (Ref: ${trackingCode})`,
      text: `Hi ${name},\n\nThank you for submitting '${eventName}' to K-Sync Malaysia.\nYour Tracking Reference Code is: ${trackingCode}\n\nYou can track the verification progress anytime at: ${trackingLink}\n\nThank you,\nK-Sync Malaysia Team`,
      html: getEmailTemplate(htmlContent)
    });

    console.log(`[Email Service] Confirmation email dispatched to: ${to} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Email Service Preview URL]: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send submission confirmation to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

// 2. Send Event Approved & Published Email
export async function sendEventApprovalEmail({
  to,
  name,
  eventName,
  eventId,
  trackingCode
}) {
  try {
    const client = await getTransporter();
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:8000';
    const eventUrl = `${appBaseUrl}/events/${eventId}`;
    const fromAddress = getFromAddress();

    const htmlContent = `
      <div style="text-align: center;">
        <span class="badge badge-verified">✓ Verified & Published Live</span>
        <h2 style="color: #ffffff; margin-top: 8px; font-size: 22px;">Congratulations ${name || 'Organizer'}!</h2>
        <p style="color: #9ca3af; margin-bottom: 20px;">Your K-Pop event submission has been reviewed, approved, and is now published live on the K-Sync Malaysia directory.</p>
      </div>

      <div class="code-card" style="border-color: #10b981;">
        <div class="code-label" style="color: #34d399;">Event Published Live</div>
        <div class="code-value" style="color: #34d399; font-size: 22px;">${eventName}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Reference Code: ${trackingCode}</div>
      </div>

      <p style="color: #d1d5db; font-size: 14px;">Fans across Malaysia can now discover your event, RSVP, bookmark it to their countdown schedule, and connect with concert buddies!</p>

      <div class="button-wrapper">
        <a href="${eventUrl}" class="btn" style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);">View Your Live Event Page →</a>
      </div>
      
      <p style="font-size: 12px; color: #6b7280; text-align: center;">Event URL: <a href="${eventUrl}" style="color: #34d399;">${eventUrl}</a></p>
    `;

    const info = await client.sendMail({
      from: fromAddress,
      replyTo: 'noreply@ksync.my',
      to,
      subject: `🎉 [K-Sync Malaysia] Your Event '${eventName}' Has Been Approved & Published!`,
      text: `Hi ${name},\n\nGreat news! Your event '${eventName}' has been verified and is now live on K-Sync Malaysia.\n\nView it live: ${eventUrl}\n\nThank you,\nK-Sync Malaysia Team`,
      html: getEmailTemplate(htmlContent)
    });

    console.log(`[Email Service] Approval notification sent to: ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send approval email to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

// 3. Send Event Rejected / Needs Correction Email (UC22 & UC23)
export async function sendEventRejectionEmail({
  to,
  name,
  eventName,
  trackingCode,
  reason
}) {
  try {
    const client = await getTransporter();
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:8000';
    const trackerUrl = `${appBaseUrl}/check-submission?code=${encodeURIComponent(trackingCode)}`;
    const fromAddress = getFromAddress();

    const htmlContent = `
      <div style="text-align: center;">
        <span class="badge badge-rejected">Action Required / Event Not Approved</span>
        <h2 style="color: #ffffff; margin-top: 8px; font-size: 22px;">Hi ${name || 'Organizer'},</h2>
        <p style="color: #9ca3af; margin-bottom: 20px;">Thank you for your submission. Our administrators reviewed your event <strong>${eventName}</strong>, but some adjustments are needed before it can be verified.</p>
      </div>

      <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #f87171; margin-bottom: 4px;">Admin Feedback / Reason:</div>
        <div style="font-size: 15px; color: #fecaca; font-style: italic;">"${reason || 'Please provide official ticket seller verification links or clearer poster image.'}"</div>
      </div>

      <div class="code-card">
        <div class="code-label">Tracking Reference Code</div>
        <div class="code-value">${trackingCode}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">You can update your event details and resubmit directly using this code.</div>
      </div>

      <p style="color: #d1d5db; font-size: 14px;">You do not need to start a brand new submission. Click the button below to update your poster image, official links, or details, and reset your status for re-review.</p>

      <div class="button-wrapper">
        <a href="${trackerUrl}" class="btn" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);">Update & Resubmit Event →</a>
      </div>
      
      <p style="font-size: 12px; color: #6b7280; text-align: center;">Resubmission URL: <a href="${trackerUrl}" style="color: #f59e0b;">${trackerUrl}</a></p>
    `;

    const info = await client.sendMail({
      from: fromAddress,
      replyTo: 'noreply@ksync.my',
      to,
      subject: `[K-Sync Malaysia] Update on Event Submission '${eventName}' (Ref: ${trackingCode})`,
      text: `Hi ${name},\n\nRegarding your event submission '${eventName}' (Ref: ${trackingCode}):\n\nThe review team provided the following feedback:\n"${reason}"\n\nPlease visit the tracking portal to correct and resubmit your event: ${trackerUrl}\n\nThank you,\nK-Sync Malaysia Team`,
      html: getEmailTemplate(htmlContent)
    });

    console.log(`[Email Service] Rejection notification sent to: ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send rejection email to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. Send Registration Verification OTP Email
 */
export async function sendRegistrationOtpEmail({ to, name = 'K-Pop Fan', otp }) {
  try {
    const client = await getTransporter();
    const fromAddress = getFromAddress();

    const htmlContent = `
      <div style="text-align: center;">
        <span class="badge badge-verified">Verification Code</span>
        <h2 style="color: #ffffff; margin-top: 4px; font-size: 22px;">Welcome to K-Sync Malaysia!</h2>
        <p style="color: #9ca3af; font-size: 14px;">Let's verify your email address to activate your account</p>
      </div>

      <p style="color: #d1d5db; font-size: 15px;">Hi <strong>${name}</strong>,</p>
      <p style="color: #d1d5db; font-size: 14px;">Thank you for joining Malaysia's centralized K-Pop event platform. Please use the following 6-digit verification code to complete your registration:</p>

      <div class="code-card">
        <div class="code-label">YOUR ONE-TIME VERIFICATION CODE</div>
        <div class="code-value">${otp}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">⏱️ Valid for 10 minutes. Please do not share this code with anyone.</div>
      </div>

      <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">Once verified, you will be able to bookmark concerts, receive real-time D-Day countdown alerts, join concert buddy chats, and submit community cup-sleeve & cafe events.</p>

      <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 24px;">If you did not initiate this registration request, please disregard this email.</p>
    `;

    const info = await client.sendMail({
      from: fromAddress,
      replyTo: 'noreply@ksync.my',
      to,
      subject: `[K-Sync Malaysia] ${otp} is your verification code`,
      text: `Hi ${name},\n\nYour K-Sync Malaysia registration verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nThank you,\nK-Sync Malaysia Team`,
      html: getEmailTemplate(htmlContent)
    });

    console.log(`[Email Service] Registration OTP sent to: ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send OTP to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 5. Send Password Reset Email with OTP Code & Direct Link
 */
export async function sendPasswordResetEmail({ to, name = 'User', resetCode, resetUrl }) {
  try {
    const client = await getTransporter();
    const fromAddress = getFromAddress();

    const htmlContent = `
      <div style="text-align: center;">
        <span class="badge" style="background-color: rgba(244, 63, 94, 0.2); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4);">Security Alert</span>
        <h2 style="color: #ffffff; margin-top: 4px; font-size: 22px;">Reset Your Password</h2>
        <p style="color: #9ca3af; font-size: 14px;">We received a request to reset your K-Sync Malaysia account password</p>
      </div>

      <p style="color: #d1d5db; font-size: 15px;">Hi <strong>${name}</strong>,</p>
      <p style="color: #d1d5db; font-size: 14px;">You requested to reset your password for your account associated with <strong>${to}</strong>. Use the 6-digit reset code below or click the button to proceed:</p>

      <div class="code-card" style="border-color: #f43f5e;">
        <div class="code-label">PASSWORD RESET CODE</div>
        <div class="code-value" style="color: #f43f5e;">${resetCode}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">⏱️ This reset code will expire in 15 minutes.</div>
      </div>

      <div class="button-wrapper">
        <a href="${resetUrl}" class="btn" style="background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%);">Reset My Password →</a>
      </div>

      <p style="font-size: 12px; color: #6b7280; text-align: center;">Direct Link: <a href="${resetUrl}" style="color: #f43f5e;">${resetUrl}</a></p>

      <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 24px;">If you did not request a password reset, no action is needed. Your existing password remains secure.</p>
    `;

    const info = await client.sendMail({
      from: fromAddress,
      replyTo: 'noreply@ksync.my',
      to,
      subject: `[K-Sync Malaysia] Password Reset Code: ${resetCode}`,
      text: `Hi ${name},\n\nYour K-Sync Malaysia password reset code is: ${resetCode}\n\nReset link: ${resetUrl}\n\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.\n\nThank you,\nK-Sync Malaysia Team`,
      html: getEmailTemplate(htmlContent)
    });

    console.log(`[Email Service] Password reset email sent to: ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send password reset email to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

export default {
  sendSubmissionConfirmationEmail,
  sendEventApprovalEmail,
  sendEventRejectionEmail,
  sendRegistrationOtpEmail,
  sendPasswordResetEmail
};

