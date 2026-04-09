/**
 * Mailosaur Code Retrieval Script
 * This script retrieves verification codes/messages from Mailosaur
 */

const MailosaurClient = require('mailosaur');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Disable SSL certificate validation for corporate proxies
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load Mailosaur configuration from testdata
const configPath = path.join(__dirname, '../testdata/Salesforce/userDetails.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_KEY = config.mailosure.API_KEY;
const SERVER_ID = config.mailosure.SERVER_ID;
const EMAIL = config.mailosure.email;

// Initialize Mailosaur client with custom agent
const mailosaur = new MailosaurClient(API_KEY, '', {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

/**
 * Get the latest email message
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 * @returns {Promise<Object>} Email message object
 */
async function getLatestEmail(timeout = 30000) {
  try {
    console.log(`\n🔍 Searching for emails in server: ${SERVER_ID}`);
    console.log(`📧 Email address: ${EMAIL}\n`);

    const criteria = {
      sentTo: EMAIL
    };

    const message = await mailosaur.messages.get(
      SERVER_ID,
      criteria,
      {
        timeout: timeout
      }
    );

    return message;
  } catch (error) {
    console.error('❌ Error fetching email:', error.message);
    throw error;
  }
}

/**
 * Extract verification code from email
 * @param {Object} message - Email message object
 * @returns {string|null} Verification code
 */
function extractVerificationCode(message) {
  try {
    // Try to extract code from subject
    const subjectMatch = message.subject?.match(/\b\d{4,8}\b/);
    if (subjectMatch) {
      return subjectMatch[0];
    }

    // Try to extract from HTML body
    if (message.html?.body) {
      const htmlMatch = message.html.body.match(/\b\d{4,8}\b/);
      if (htmlMatch) {
        return htmlMatch[0];
      }
    }

    // Try to extract from text body
    if (message.text?.body) {
      const textMatch = message.text.body.match(/\b\d{4,8}\b/);
      if (textMatch) {
        return textMatch[0];
      }
    }

    // Look for common verification code patterns
    const codePatterns = [
      /verification code[:\s]+(\d{4,8})/i,
      /your code[:\s]+(\d{4,8})/i,
      /code[:\s]+(\d{4,8})/i,
      /otp[:\s]+(\d{4,8})/i,
      /pin[:\s]+(\d{4,8})/i
    ];

    const fullText = `${message.subject} ${message.html?.body || ''} ${message.text?.body || ''}`;
    
    for (const pattern of codePatterns) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Error extracting code:', error.message);
    return null;
  }
}

/**
 * Display email details
 * @param {Object} message - Email message object
 */
function displayEmailDetails(message) {
  console.log('📬 Email Details:');
  console.log('━'.repeat(60));
  console.log(`From: ${message.from?.[0]?.email || 'N/A'}`);
  console.log(`To: ${message.to?.[0]?.email || 'N/A'}`);
  console.log(`Subject: ${message.subject || 'N/A'}`);
  console.log(`Received: ${message.received || 'N/A'}`);
  console.log('━'.repeat(60));
  
  // Extract and display verification code
  const code = extractVerificationCode(message);
  if (code) {
    console.log(`\n✅ Verification Code Found: ${code}\n`);
  } else {
    console.log('\n⚠️  No verification code found in email\n');
  }

  // Display email content preview
  console.log('📄 Email Content Preview:');
  console.log('━'.repeat(60));
  if (message.text?.body) {
    const preview = message.text.body.substring(0, 500);
    console.log(preview);
    if (message.text.body.length > 500) {
      console.log('... (truncated)');
    }
  } else if (message.html?.body) {
    const preview = message.html.body.substring(0, 500);
    console.log(preview);
    if (message.html.body.length > 500) {
      console.log('... (truncated)');
    }
  }
  console.log('━'.repeat(60));
}

/**
 * List all messages in the server
 * @param {number} limit - Maximum number of messages to retrieve
 */
async function listAllMessages(limit = 10) {
  try {
    console.log(`\n📋 Listing last ${limit} messages...\n`);
    
    const messages = await mailosaur.messages.list(SERVER_ID);
    
    if (!messages.items || messages.items.length === 0) {
      console.log('📭 No messages found in mailbox\n');
      return;
    }

    console.log(`Found ${messages.items.length} message(s):\n`);
    
    messages.items.slice(0, limit).forEach((msg, index) => {
      console.log(`${index + 1}. Subject: ${msg.subject || 'N/A'}`);
      console.log(`   From: ${msg.from?.[0]?.email || 'N/A'}`);
      console.log(`   Received: ${msg.received || 'N/A'}`);
      console.log(`   ID: ${msg.id}`);
      
      const code = extractVerificationCode(msg);
      if (code) {
        console.log(`   🔑 Code: ${code}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error listing messages:', error.message);
    throw error;
  }
}

/**
 * Delete all messages from the server
 */
async function deleteAllMessages() {
  try {
    console.log('\n🗑️  Deleting all messages...\n');
    await mailosaur.messages.deleteAll(SERVER_ID);
    console.log('✅ All messages deleted successfully\n');
  } catch (error) {
    console.error('❌ Error deleting messages:', error.message);
    throw error;
  }
}

/**
 * Get message by ID
 * @param {string} messageId - Message ID
 */
async function getMessageById(messageId) {
  try {
    console.log(`\n🔍 Fetching message with ID: ${messageId}\n`);
    const message = await mailosaur.messages.getById(messageId);
    displayEmailDetails(message);
    return message;
  } catch (error) {
    console.error('❌ Error fetching message:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'latest';

  console.log('\n🚀 Mailosaur Code Retrieval Script');
  console.log('═'.repeat(60));

  try {
    switch (command) {
      case 'latest':
        const timeout = parseInt(args[1]) || 30000;
        const message = await getLatestEmail(timeout);
        displayEmailDetails(message);
        break;

      case 'list':
        const limit = parseInt(args[1]) || 10;
        await listAllMessages(limit);
        break;

      case 'delete':
        await deleteAllMessages();
        break;

      case 'get':
        if (!args[1]) {
          console.error('❌ Error: Message ID is required');
          console.log('Usage: node mailosaur-get-code.js get <message-id>');
          process.exit(1);
        }
        await getMessageById(args[1]);
        break;

      case 'help':
      default:
        console.log('\n📖 Usage:');
        console.log('  node mailosaur-get-code.js [command] [options]\n');
        console.log('Commands:');
        console.log('  latest [timeout]     Get the latest email (default timeout: 30000ms)');
        console.log('  list [limit]         List recent emails (default limit: 10)');
        console.log('  delete               Delete all emails from the server');
        console.log('  get <message-id>     Get specific email by ID');
        console.log('  help                 Show this help message\n');
        console.log('Examples:');
        console.log('  node mailosaur-get-code.js latest');
        console.log('  node mailosaur-get-code.js latest 60000');
        console.log('  node mailosaur-get-code.js list 5');
        console.log('  node mailosaur-get-code.js delete');
        console.log('  node mailosaur-get-code.js get abc123\n');
        break;
    }
  } catch (error) {
    console.error('\n💥 Script failed:', error.message);
    process.exit(1);
  }

  console.log('═'.repeat(60));
  console.log('✨ Script completed\n');
}

// Run the script
if (require.main === module) {
  main();
}

// Export functions for use in other modules
module.exports = {
  getLatestEmail,
  extractVerificationCode,
  listAllMessages,
  deleteAllMessages,
  getMessageById,
  mailosaur,
  SERVER_ID,
  EMAIL
};
