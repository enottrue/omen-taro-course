import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
};

// Log email configuration (without password)
console.log('Email configuration:', {
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  user: emailConfig.auth.user,
  hasPassword: !!emailConfig.auth.pass && emailConfig.auth.pass !== 'your-app-password'
});

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string = 'User') => ({
    subject: 'Password Recovery - Cosmo Irena',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cosmo Irena</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Recovery</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">Hello, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset the password for your account. 
            If you did not make this request, please ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #3498db; font-size: 14px; word-break: break-all;">
            ${resetUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent automatically. Please do not reply to it.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Recovery - Cosmo Irena
      
      Hello, ${userName}!
      
      We received a request to reset the password for your account. 
      If you did not make this request, please ignore this email.
      
      To reset your password, please visit this link:
      ${resetUrl}
      
      Best regards,
      Cosmo Irena Team
    `
  })
};

// Email service functions
export const emailService = {
  // Send password reset email
  async sendPasswordResetEmail(email: string, resetUrl: string, userName?: string) {
    try {
      // Check if SMTP credentials are configured
      const hasSmtpConfig = emailConfig.auth.user !== 'your-email@gmail.com' && 
                           emailConfig.auth.pass !== 'your-app-password' &&
                           emailConfig.auth.user !== 'support@astro-irena.com' &&
                           emailConfig.auth.pass !== 'your-password-here';

      // In development, check if we should send real emails
      if (process.env.NODE_ENV === 'development') {
        if (hasSmtpConfig) {
          console.log('=== SENDING REAL EMAIL (DEVELOPMENT MODE) ===');
          console.log('SMTP credentials found, sending real email...');
          
          // Send real email in development
          const template = emailTemplates.passwordReset(resetUrl, userName);
          
          const mailOptions = {
            from: `"Cosmo Irena" <${emailConfig.auth.user}>`,
            to: email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          };

          const info = await transporter.sendMail(mailOptions);
          
          console.log('Email sent successfully:', info.messageId);
          console.log('=== END REAL EMAIL ===');
          return { success: true, messageId: info.messageId };
        } else {
          // Log email to console if no SMTP config
          console.log('=== EMAIL SEND (DEVELOPMENT MODE - CONSOLE ONLY) ===');
          console.log('To:', email);
          console.log('Subject: Восстановление пароля - Cosmo Irena');
          console.log('Reset URL:', resetUrl);
          console.log('Note: To send real emails in development, configure SMTP credentials');
          console.log('=== END EMAIL ===');
          return { success: true, message: 'Email logged to console (development mode)' };
        }
      }

      // In production, always send real emails
      const template = emailTemplates.passwordReset(resetUrl, userName);
      
      const mailOptions = {
        from: `"Cosmo Irena" <${emailConfig.auth.user}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error: any) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  },

  // Verify email configuration
  async verifyConnection() {
    try {
      await transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error: any) {
      console.error('Email service verification failed:', error);
      return false;
    }
  },

  // Check if SMTP is configured
  isSmtpConfigured() {
    return emailConfig.auth.user !== 'your-email@gmail.com' && 
           emailConfig.auth.pass !== 'your-app-password' &&
           emailConfig.auth.user !== 'support@astro-irena.com' &&
           emailConfig.auth.pass !== 'your-password-here';
  }
};

export default emailService; 