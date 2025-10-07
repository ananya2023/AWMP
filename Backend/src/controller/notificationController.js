const notificationService = require('../service/notificationService');
const pantryService = require('../service/Service');

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

exports.sendBulkExpiryNotifications = async (req, res) => {
  try {
    const users = await pantryService.getAllUsers();
    let sentCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        await notificationService.sendExpiryNotifications(user.user_id, user.email);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send notification to user ${user.user_id}:`, error);
        errorCount++;
      }
    }

    res.status(200).json({ 
      message: 'Bulk notifications completed',
      totalUsers: users.length,
      sentCount,
      errorCount
    });

  } catch (error) {
    console.error('Error in sendBulkExpiryNotifications:', error);
    res.status(500).json({ message: error.message });
  }
};
