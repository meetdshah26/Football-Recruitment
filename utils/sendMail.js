const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

const logoLink =
  'https://admin.footballrecruitment.eu/app-assets/images/logo/logo.png';

const sendOtp = function (to, otp) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MJ_FROM,
          Name: process.env.MJ_NAME,
        },
        To: [{ Email: to }],
        Subject: 'Reset Password',
        HTMLPart: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 900px; overflow: auto; line-height: 2; font-size: 1.1em;">
        <div style="margin: 50px auto; width:70%; padding: 20px 0;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <a href="${process.env.CLIENT_URL}" style="font-size:1.4em; color: #004D7F; text-decoration:none; font-weight:600;">
                    <img src="${logoLink}" alt="Football Recruitment" width="100">
                </a>
            </div>
            <p style="font-size: 1.1em;">Hello,</p>
            <p>We received a request to reset the password for your account associated with this email address. If you made this request, please use OTP given below to reset your password:</p>
            <h2 style="background: #004D7F; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
            <p>For security reasons, this OTP will expire in 5 minutes from the time this email was sent.</p>
            <p>If you didn't request a password reset, please ignore this email. Your account will remain safe as long as you don't share this OTP with anyone.</p>
            <p style="font-size: 0.9em;">Regards,<br />Football Recruitment</p>
        </div>
    </div>`,
      },
    ],
  });

  request.catch((error) => {
    console.error('Error sending email', error);
  });
};

const sendLink = function (to, link) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MJ_FROM,
          Name: process.env.MJ_NAME,
        },
        To: [{ Email: to }],
        Subject: 'Reset Password',
        HTMLPart: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 900px; overflow: auto; line-height: 2; font-size: 1.1em;">
        <div style="margin: 50px auto; width:70%; padding: 20px 0;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <a href="${process.env.CLIENT_URL}" style="font-size:1.4em; color: #004D7F; text-decoration:none; font-weight:600;">
                    <img src="${logoLink}" alt="Football Recruitment" width="100">
                </a>
            </div>
            <p style="font-size: 1.1em;">Hello,</p>
            <p>We received a request to reset the password for your account associated with this email address. To proceed, please click on the link below:</p>
            <a href="${link}" style="text-decoration: none;">
                <h2 style="background: #004D7F; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">Reset Password</h2>
            </a>
            <p>For security reasons, the provided link will expire within 5 minutes from the time this email was sent.</p>
            <p>If you didn't request a password reset, please ignore this email. Your account will remain safe as long as you don't click on the link or share it with anyone.</p>
            <p style="font-size: 0.9em;">Regards,<br />Football Recruitment</p>
        </div>
    </div>`,
      },
    ],
  });

  request.catch((error) => {
    console.error('Error sending email', error);
  });
};

const sendPassword = function (to, password, position, name) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MJ_FROM,
          Name: process.env.MJ_NAME,
        },
        To: [{ Email: to }],
        Subject: 'Welcome to Football Recruitment',
        HTMLPart: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 900px; overflow: auto; line-height: 2; font-size: 1.1em;">
         <div style="margin: 50px auto; width:70%; padding: 20px 0;">
         <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <a href="${process.env.CLIENT_URL}" style="font-size:1.4em; color: #004D7F; text-decoration:none; font-weight:600;">
                <img src="${logoLink}" alt="Football Recruitment" width="100">
            </a>
        </div>
        <p style="font-size: 1.1em;">Hello ${name},</p>
        <p>Welcome to Football Recruitment!</p>
        <p>Your account has been created, and here is your generated password:-</p>
        <p style="font-size: 1.2em; background: #004D7F; margin: 10px auto; width: max-content; padding: 10px; color: #fff; border-radius: 4px;">${password}</p>
        <p>Please keep your password secure and consider changing it after your first login for added security.</p>
        <p>Your application for the position of <span style="font-weight: bold;">${position}</span> has been successfully received.</p>
        <p>We will review your application and get back to you as soon as possible.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p style="font-size: 0.9em;">Regards,<br />Football Recruitment</p>
        </div>
        </div>`,
      },
    ],
  });

  request.catch((error) => {
    console.error('Error sending email', error);
  });
};

const sendApplicationConfirmation = function (to, position, name) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MJ_FROM,
          Name: process.env.MJ_NAME,
        },
        To: [{ Email: to }],
        Subject: 'Application Confirmation - Football Recruitment',
        HTMLPart: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 900px; overflow: auto; line-height: 2; font-size: 1.1em;">
         <div style="margin: 50px auto; width:70%; padding: 20px 0;">
         <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <a href="${process.env.CLIENT_URL}" style="font-size:1.4em; color: #004D7F; text-decoration:none; font-weight:600;">
                <img src="${logoLink}" alt="Football Recruitment" width="100">
            </a>
        </div>
        <p style="font-size: 1.1em;">Hello ${name},</p>
        <p>Your application for the position of <span style="font-weight: bold;">${position}</span> has been successfully received.</p>
        <p>We will review your application and get back to you as soon as possible.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p style="font-size: 0.9em;">Regards,<br />Football Recruitment</p>
        </div>
        </div>`,
      },
    ],
  });

  request.catch((error) => {
    console.error('Error sending email', error);
  });
};

module.exports = {
  sendOtp,
  sendLink,
  sendPassword,
  sendApplicationConfirmation,
};
