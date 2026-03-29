const mongoose = require('mongoose');
const User = require('./models/userModel');
const connectDB = require('./config/db');

// Load env vars if needed (assuming they are already in process.env from server)
// But for a standalone script, we might need to load them manually or rely on terminal

const cleanup = async () => {
   try {
      await connectDB();
      
      // Update John Doe's phone if it contains netflix
      const john = await User.findOne({ email: 'john@example.com' });
      if (john) {
         if (john.phone && john.phone.includes('netflix')) {
            john.phone = '+91 98765 43210';
            await john.save();
            console.log('Cleaned up John Doe phone number.');
         }
         
         if (john.address === '') {
            john.address = '123, Food Street, Gourmet City, GC 500001';
            await john.save();
            console.log('Set default address for John Doe.');
         }
      }

      // Check all users for netflix remnants
      const netflixUsers = await User.find({ 
         $or: [
            { email: /netflix/i },
            { name: /netflix/i },
            { phone: /netflix/i },
            { address: /netflix/i }
         ]
      });

      if (netflixUsers.length > 0) {
         console.log(`Found ${netflixUsers.length} users with Netflix remnants. Cleaning...`);
         for (let user of netflixUsers) {
            if (user.phone && user.phone.includes('netflix')) user.phone = '';
            if (user.address && user.address.includes('netflix')) user.address = '';
            await user.save();
         }
      }

      console.log('Data cleanup complete.');
      process.exit(0);
   } catch (err) {
      console.error('Cleanup failed:', err);
      process.exit(1);
   }
};

cleanup();
