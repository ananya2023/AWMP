const nodemailer = require('nodemailer');
const pantryService = require('./Service');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ananya.miriyala474@gmail.com',
    pass: 'ihxx xqjs daej ffnu'
  }
});

// Generate HTML email template
const generateEmailHTML = (userName, expiringItems, totalWastePrevented, moneySaved) => {
  const expiredItems = expiringItems.filter(item => item.daysLeft < 0);
  const urgentItems = expiringItems.filter(item => item.daysLeft === 0);
  const soonItems = expiringItems.filter(item => item.daysLeft > 0 && item.daysLeft <= 3);

  const expiredItemsHTML = expiredItems.map(item => `
    <div style="background-color: #450a0a; border: 1px solid #7f1d1d; border-radius: 8px; padding: 16px; margin-bottom: 16px; color: white;">
      <div style="display: flex; align-items: center;">
        <img src="${item.image || 'https://via.placeholder.com/64'}" alt="${item.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;" />
        <div style="flex: 1;">
          <h4 style="font-weight: bold; color: white; margin: 0;">${item.name}</h4>
          <p style="color: #fca5a5; font-size: 14px; margin: 4px 0;">${item.quantity}</p>
          <p style="color: #fca5a5; font-weight: 500; font-size: 14px; margin: 0;">Expired ${Math.abs(item.daysLeft)} day${Math.abs(item.daysLeft) > 1 ? 's' : ''} ago</p>
        </div>
      </div>
    </div>
  `).join('');

  const urgentItemsHTML = urgentItems.map(item => `
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center;">
        <img src="${item.image || 'https://via.placeholder.com/64'}" alt="${item.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;" />
        <div style="flex: 1;">
          <h4 style="font-weight: bold; color: #111827; margin: 0;">${item.name}</h4>
          <p style="color: #6b7280; font-size: 14px; margin: 4px 0;">${item.quantity}</p>
          <p style="color: #dc2626; font-weight: 500; font-size: 14px; margin: 0;">Expires today!</p>
        </div>
      </div>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #fecaca;">
        <p style="font-size: 14px; font-weight: 500; color: #111827; margin: 0 0 8px 0;">🍳 Quick Recipe Ideas:</p>
        <div style="display: flex; flex-wrap: wrap;">
          ${item.suggestedRecipes?.map(recipe => `
            <span style="background-color: white; border: 1px solid #fecaca; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; margin-bottom: 4px;">${recipe}</span>
          `).join('') || ''}
        </div>
      </div>
    </div>
  `).join('');

  const soonItemsHTML = soonItems.map(item => `
    <div style="background-color: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; margin-right: 16px;">
          <img src="${item.image || 'https://via.placeholder.com/48'}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; margin-right: 16px;" />
          <div>
            <h4 style="font-weight: 500; color: #111827; margin: 0;">${item.name}</h4>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">${item.quantity}</p>
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0;">
          <p style="color: #d97706; font-weight: 500; font-size: 14px; margin: 0;">${item.daysLeft} days left</p>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cooksy Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); color: white; padding: 32px; text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 16px;">
            🌱
          </div>
          <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0;">🌱 Cooksy Alert</h1>
          <p style="color: #a7f3d0; font-size: 18px; margin: 0;">Your Food Rescue Mission Awaits!</p>
        </div>

        <!-- Personal Greeting -->
        <div style="padding: 24px; background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%); border-left: 4px solid #fb923c;">
          <div>
            <div style="display: flex; align-items: center;">
              <div style="background-color: #f97316; padding: 8px; border-radius: 50%; color: white; margin-right: 12px;">⚠️</div>
              <h2 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0;">Hi ${userName}! 👋</h2>
            </div>
            <div style="margin-left: 44px;">
              <p style="color: #374151; line-height: 1.6; margin: 0;">We've detected <strong>${expiringItems.length} item(s)</strong> in your pantry that need attention. Let's turn them into delicious meals and prevent food waste together!</p>
            </div>
          </div>
        </div>

        ${expiredItems.length > 0 ? `
        <!-- Expired Items -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background-color: #7f1d1d; padding: 8px; border-radius: 8px; color: white; margin-right: 8px;">💀</div>
            <h3 style="font-size: 18px; font-weight: bold; color: #450a0a; margin: 0 0 0 0;">⚠️ Already Expired</h3>
            <span style="background-color: #450a0a; color: white; padding: 4px 8px; border-radius: 20px; font-size: 14px; font-weight: 500;">${expiredItems.length} item(s)</span>
          </div>
          ${expiredItemsHTML}
        </div>
        ` : ''}

        ${urgentItems.length > 0 ? `
        <!-- Urgent Items -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background-color: #ef4444; padding: 8px; border-radius: 8px; color: white; margin-right: 8px;">🕐</div>
            <h3 style="font-size: 18px; font-weight: bold; color: #7f1d1d; margin: 0 0 0 0;">🚨 Use Today!</h3>
            <span style="background-color: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 20px; font-size: 14px; font-weight: 500;">${urgentItems.length} item(s)</span>
          </div>
          ${urgentItemsHTML}
        </div>
        ` : ''}

        ${soonItems.length > 0 ? `
        <!-- Soon Expiring Items -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background-color: #eab308; padding: 8px; border-radius: 8px; color: white; margin-right: 8px;">📅</div>
            <h3 style="font-size: 18px; font-weight: bold; color: #92400e; margin: 0 0 0 0;">⏰ Use Soon</h3>
            <span style="background-color: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 20px; font-size: 14px; font-weight: 500;">${soonItems.length} item(s)</span>
          </div>
          ${soonItemsHTML}
        </div>
        ` : ''}

  

        <!-- Call to Action -->
        <div style="padding: 24px; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); color: white; text-align: center;">
          <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 8px 0;">Ready to Save Your Food? 🚀</h3>
          <p style="color: #a7f3d0; margin: 0 0 16px 0;">Don't let these ingredients go to waste! Open your Coosky app and start cooking.</p>
          <div style="margin-bottom: 12px;">
            <a href="https://frontend-cooksy-v1-518421407309.asia-south1.run.app/" style="background-color: white; color: #10b981; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">Open Coosky App</a>
          </div>
          <div style="display: flex; justify-content: space-around; align-items: center; font-size: 14px; max-width: 500px; margin: 0 auto;">
            <a href="https://frontend-cooksy-v1-518421407309.asia-south1.run.app/pantry" style="color: #a7f3d0; text-decoration: underline; padding: 8px 12px;">View Pantry</a>
            <a href="https://frontend-cooksy-v1-518421407309.asia-south1.run.app/suggestions" style="color: #a7f3d0; text-decoration: underline; padding: 8px 12px;">Browse Recipes</a>
            <a href="https://frontend-cooksy-v1-518421407309.asia-south1.run.app/meal-plans" style="color: #a7f3d0; text-decoration: underline; padding: 8px 12px;">Meal Planner</a>
            <a href="https://frontend-cooksy-v1-518421407309.asia-south1.run.app/recipes" style="color: #a7f3d0; text-decoration: underline; padding: 8px 12px;">Your Recipes</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">© 2025 Coosky. All rights reserved. | You're receiving this because you have items expiring soon.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Transform pantry items to email format
const transformPantryItems = (pantryItems) => {
  return pantryItems.map(item => {
    const today = new Date();
    const expiryDate = new Date(item.expiry_date);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    return {
      id: item.id,
      name: item.item_name,
      quantity: `${item.quantity || '1'} ${item.unit || 'unit'}`,
      daysLeft: Math.max(0, daysLeft),
      category: item.category || 'general',
      image: item.image_url || 'https://via.placeholder.com/100',
      suggestedRecipes: generateRecipeSuggestions(item.item_name)
    };
  });
};

// Generate recipe suggestions based on item
const generateRecipeSuggestions = (itemName) => {
  const recipeMap = {
    'carrots': ['Carrot Soup', 'Roasted Carrots', 'Carrot Cake'],
    'bananas': ['Banana Bread', 'Smoothie Bowl', 'Banana Pancakes'],
    'spinach': ['Green Smoothie', 'Spinach Pasta', 'Wilted Spinach'],
    'bread': ['French Toast', 'Bread Pudding', 'Croutons'],
    'tomatoes': ['Tomato Sauce', 'Caprese Salad', 'Tomato Soup'],
    'potatoes': ['Mashed Potatoes', 'Roasted Potatoes', 'Potato Soup']
  };
  
  const itemLower = itemName.toLowerCase();
  for (const [key, recipes] of Object.entries(recipeMap)) {
    if (itemLower.includes(key)) {
      return recipes;
    }
  }
  return ['Quick Stir Fry', 'Everything Soup', 'Creative Salad'];
};

// Calculate impact metrics
const calculateImpactMetrics = (expiringItems) => {
  const totalWeight = expiringItems.length * 0.5; // Estimate 0.5 lbs per item
  const avgPrice = 3.50; // Average price per item
  const totalValue = expiringItems.length * avgPrice;
  
  return {
    totalWastePrevented: `${totalWeight.toFixed(1)} lbs`,
    moneySaved: `$${totalValue.toFixed(2)}`
  };
};

// Main Function to send expiry notifications
exports.sendExpiryNotifications = async (user_id, user_email, userName = 'User') => {
  try {
    // Get items expiring in <= 3 days
    const pantryItems = await pantryService.getPantryItemsByUserId(user_id, 3);

    if (pantryItems.length === 0) {
      console.log("No expiring items found.");
      return { success: true, message: 'No expiring items found' };
    }

    // Transform items for email template
    const expiringItems = transformPantryItems(pantryItems);
    const { totalWastePrevented, moneySaved } = calculateImpactMetrics(expiringItems);

    // Generate HTML email
    const emailHTML = generateEmailHTML(userName, expiringItems, totalWastePrevented, moneySaved);

    const mailOptions = {
      from: 'ananya.miriyala474@gmail.com',
      to: user_email,
      subject: '🌱 Cooksy Alert - Your Food Rescue Mission Awaits!',
      html: emailHTML
    };

    // Send Mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    
    return { 
      success: true, 
      message: `Email sent successfully to ${user_email}`,
      itemCount: expiringItems.length
    };

  } catch (error) {
    console.error('Error sending expiry notification:', error);
    return { 
      success: false, 
      message: 'Failed to send email notification',
      error: error.message
    };
  }
};

// Export email template generator for testing
exports.generateEmailHTML = generateEmailHTML;
exports.transformPantryItems = transformPantryItems;