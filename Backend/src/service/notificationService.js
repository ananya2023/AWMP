const nodemailer = require('nodemailer');
const pantryService = require('./Service'); // your existing service file

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ananya.miriyala474@gmail.com',
    pass: 'ihxx xqjs daej ffnu'
  }
});

// Main Function to send expiry notifications
exports.sendExpiryNotifications = async (user_id, user_email) => {
  try {
    // Get items expiring in <= 3 days
    const expiringItems = await pantryService.getPantryItemsByUserId(user_id, 3);

    if (expiringItems.length === 0) {
      console.log("No expiring items found.");
      return;
    }

    // Compose Email Content
    let itemList = expiringItems.map(item => 
      `<li>${item.item_name} - expires on ${item.expiry_date.toDateString()}</li>`
    ).join('');

    const mailOptions = {
      from: 'ananya.miriyala474@gmail.com',
      to: user_email,
      subject: 'MealRescue: Items Expiring Soon!',
      html: `
        <h3>Hello,</h3>
        <p>The following items in your pantry are expiring soon (within 3 days):</p>
        <ul>${itemList}</ul>
        <p>Please make use of them or plan a recipe accordingly.</p>
        <p>— MealRescue Team</p>
      `
    };

    // Send Mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

  } catch (error) {
    console.error('Error sending expiry notification:', error);
  }
};
