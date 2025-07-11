interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // В режиме разработки просто выводим в консоль
    console.log('=== EMAIL WOULD BE SENT ===');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('HTML:', options.html);
    console.log('=== END EMAIL ===');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string, userName: string): Promise<boolean> => {
  const subject = 'Восстановление пароля - Omen Tarot';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Восстановление пароля</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #002B80; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #002B80; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Omen Tarot</h1>
        </div>
        <div class="content">
          <h2>Здравствуйте, ${userName}!</h2>
          <p>Вы запросили восстановление пароля для вашего аккаунта.</p>
          <p>Для сброса пароля нажмите на кнопку ниже:</p>
          <a href="${resetUrl}" class="button">Сбросить пароль</a>
          <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p><strong>Внимание:</strong> Эта ссылка действительна только 1 час.</p>
          <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
        </div>
        <div class="footer">
          <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
          <p>&copy; 2024 Omen Tarot. Все права защищены.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject,
    html
  });
}; 