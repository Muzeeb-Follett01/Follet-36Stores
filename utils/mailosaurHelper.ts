import MailosaurClient from 'mailosaur';

/**
 * MailosaurHelper - Utility class for retrieving verification codes from Mailosaur
 */
export class MailosaurHelper {
    private client: MailosaurClient;
    private serverId: string;

    constructor(apiKey: string, serverId: string) {
        // Disable SSL certificate validation for corporate proxies
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        
        this.client = new MailosaurClient(apiKey);
        this.serverId = serverId;
    }

    /**
     * Waits for and retrieves the latest email sent to the specified email address
     * @param email - The email address to check
     * @param timeout - Timeout in milliseconds (default: 60000)
     * @returns The email message object
     */
    async getLatestEmail(email: string, timeout: number = 60000) {
        console.log(`🔍 Waiting for email to: ${email}`);
        console.log(`⏱️ Timeout: ${timeout}ms`);

        try {
            const message = await this.client.messages.get(
                this.serverId,
                { sentTo: email },
                { timeout }
            );

            console.log(`✅ Email received: ${message.subject}`);
            return message;
        } catch (error) {
            console.error('❌ Error fetching email:', error);
            throw error;
        }
    }

    /**
     * Extracts a 6-digit verification code from the email body
     * @param message - The email message object
     * @returns The 6-digit verification code
     */
    extractSixDigitCode(message: any): string | null {
        console.log('🔐 Extracting 6-digit verification code from email...');

        // Check text body
        if (message.text?.body) {
            const textMatch = message.text.body.match(/\b\d{6}\b/);
            if (textMatch) {
                console.log(`✅ Code found in text body: ${textMatch[0]}`);
                return textMatch[0];
            }
        }

        // Check HTML body
        if (message.html?.body) {
            const htmlMatch = message.html.body.match(/\b\d{6}\b/);
            if (htmlMatch) {
                console.log(`✅ Code found in HTML body: ${htmlMatch[0]}`);
                return htmlMatch[0];
            }
        }

        // Check subject
        if (message.subject) {
            const subjectMatch = message.subject.match(/\b\d{6}\b/);
            if (subjectMatch) {
                console.log(`✅ Code found in subject: ${subjectMatch[0]}`);
                return subjectMatch[0];
            }
        }

        // Try common patterns for verification codes
        const codePatterns = [
            /verification code[:\s]+(\d{6})/i,
            /your code[:\s]+(\d{6})/i,
            /code[:\s]+(\d{6})/i,
            /otp[:\s]+(\d{6})/i,
            /pin[:\s]+(\d{6})/i
        ];

        const fullText = `${message.subject || ''} ${message.html?.body || ''} ${message.text?.body || ''}`;

        for (const pattern of codePatterns) {
            const match = fullText.match(pattern);
            if (match && match[1]) {
                console.log(`✅ Code found with pattern: ${match[1]}`);
                return match[1];
            }
        }

        console.error('❌ No 6-digit code found in email');
        return null;
    }

    /**
     * Prints the full email content to console
     * @param message - The email message object
     */
    printEmailContent(message: any) {
        console.log('\n📧 ═══════════════════════════════════════════════════');
        console.log('📧 EMAIL CONTENT');
        console.log('📧 ═══════════════════════════════════════════════════');
        console.log(`📬 From: ${message.from?.[0]?.email || 'N/A'}`);
        console.log(`📬 To: ${message.to?.[0]?.email || 'N/A'}`);
        console.log(`📬 Subject: ${message.subject || 'N/A'}`);
        console.log(`📬 Received: ${message.received || 'N/A'}`);
        console.log('\n📄 ─── TEXT BODY ───');
        console.log(message.text?.body || 'No text body');
        if (message.html?.body) {
            console.log('\n🌐 ─── HTML BODY (First 500 chars) ───');
            console.log(message.html.body.substring(0, 500));
            if (message.html.body.length > 500) {
                console.log('... (truncated)');
            }
        }
        console.log('\n📧 ═══════════════════════════════════════════════════\n');
    }

    /**
     * Retrieves the latest email and extracts a 6-digit verification code
     * @param email - The email address to check
     * @param timeout - Timeout in milliseconds (default: 60000)
     * @returns The 6-digit verification code
     */
    async getVerificationCode(email: string, timeout: number = 60000): Promise<string> {
        const message = await this.getLatestEmail(email, timeout);
        
        // Print full email content
        this.printEmailContent(message);
        
        const code = this.extractSixDigitCode(message);

        if (!code) {
            throw new Error('Failed to extract 6-digit verification code from email');
        }

        return code;
    }

    /**
     * Deletes all messages in the Mailosaur server
     */
    async deleteAllMessages() {
        console.log('🗑️ Deleting all messages from Mailosaur server...');
        await this.client.messages.deleteAll(this.serverId);
        console.log('✅ All messages deleted');
    }
}
