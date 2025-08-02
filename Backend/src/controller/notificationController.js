const notificationService = require('../service/notificationService');

exports.sendExpiryNotification = async (req, res) => {
  try {
    const { user_id, email } = req.body;

    if (!user_id || !email) {
      return res.status(400).json({ message: 'user_id and email are required' });
    }

    const data = await notificationService.sendExpiryNotifications(user_id, email);

    res.status(200).json({ message: 'Notification email sent (if items were expiring)' , data });

  } catch (error) {
    console.error('Error in sendExpiryNotification:', error);
    res.status(500).json({ message: error.message });
  }
};
