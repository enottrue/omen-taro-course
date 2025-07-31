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
  }),
  
  welcomeEmail: (userName: string, email: string, password: string, siteUrl: string = 'https://astro-irena.com') => ({
    subject: 'Welcome to Cosmo.Irena!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cosmo.Irena</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Welcome to Your Account</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">Hi ${userName},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You've successfully created an account on Cosmo.Irena.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Here are your login details:</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Click the button below to access the site:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}" 
               style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Go to Website
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Best regards,<br>
            Cosmo.Irena.
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to Cosmo.Irena!
      
      Hi ${userName},
      
      You've successfully created an account on Cosmo.Irena.
      
      Here are your login details:
      Email: ${email}
      Password: ${password}
      
      Click the button below to access the site:
      
      Visit our website: ${siteUrl}
      
      Best regards,
      Cosmo.Irena.
    `
  })
};

// Email service functions
export const emailService = {
  // Send welcome email after registration
  async sendWelcomeEmail(email: string, userName: string, password: string, siteUrl?: string) {
    try {
      // Check if SMTP credentials are configured
      const hasSmtpConfig = emailConfig.auth.user !== 'your-email@gmail.com' && 
                           emailConfig.auth.pass !== 'your-app-password' &&
                           emailConfig.auth.user !== 'support@astro-irena.com' &&
                           emailConfig.auth.pass !== 'your-password-here';

      // In development, check if we should send real emails
      if (process.env.NODE_ENV === 'development') {
        if (hasSmtpConfig) {
          console.log('=== SENDING WELCOME EMAIL (DEVELOPMENT MODE) ===');
          console.log('SMTP credentials found, sending real welcome email...');
          
          // Send real email in development
          const template = emailTemplates.welcomeEmail(userName, email, password, siteUrl);
          
          const mailOptions = {
            from: `"Cosmo Irena" <${emailConfig.auth.user}>`,
            to: email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          };

          const info = await transporter.sendMail(mailOptions);
          
          console.log('Welcome email sent successfully:', info.messageId);
          console.log('=== END WELCOME EMAIL ===');
          return { success: true, messageId: info.messageId };
        } else {
          // Log email to console if no SMTP config
          console.log('=== WELCOME EMAIL SEND (DEVELOPMENT MODE - CONSOLE ONLY) ===');
          console.log('To:', email);
          console.log('Subject: Welcome to Cosmo.Irena!');
          console.log('User Name:', userName);
          console.log('Password:', password);
          console.log('Site URL:', siteUrl);
          console.log('Note: To send real emails in development, configure SMTP credentials');
          console.log('=== END WELCOME EMAIL ===');
          return { success: true, message: 'Welcome email logged to console (development mode)' };
        }
      }

      // In production, always send real emails
      const template = emailTemplates.welcomeEmail(userName, email, password, siteUrl);
      
      const mailOptions = {
        from: `"Cosmo Irena" <${emailConfig.auth.user}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('Welcome email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error: any) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },

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