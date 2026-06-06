import nodemailer from 'nodemailer';

let transporter = null;

// Initialize the mail transporter
const initTransporter = async () => {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        console.log('Using custom SMTP configuration for email service.');
        transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    } else {
        console.log('No custom SMTP found. Generating Ethereal SMTP test credentials...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log(`Ethereal Test account generated successfully! User: ${testAccount.user}`);
        } catch (error) {
            console.error('Failed to create Ethereal SMTP test account, falling back to mock logging:', error.message);
            transporter = {
                sendMail: async (mailOptions) => {
                    console.log('--- MOCK EMAIL SENT ---');
                    console.log(`To: ${mailOptions.to}`);
                    console.log(`Subject: ${mailOptions.subject}`);
                    console.log(`Body: ${mailOptions.text}`);
                    console.log('------------------------');
                    return { messageId: 'mock-id-' + Date.now() };
                }
            };
        }
    }
    return transporter;
};

// HTML base layout wrapper
const getHtmlLayout = (title, content) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #faf8f5; color: #2d3748; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #d4af37; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #d4af37; }
            .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.8; }
            .content { padding: 30px; line-height: 1.6; }
            .status-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
            .status-confirmed { background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
            .status-cancelled { background-color: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
            .status-pending { background-color: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .details-table th, .details-table td { padding: 12px 15px; text-align: left; }
            .details-table th { background-color: #f7fafc; font-size: 11px; text-transform: uppercase; tracking-wider; color: #718096; font-weight: bold; border-bottom: 1px solid #e2e8f0; }
            .details-table td { font-size: 14px; border-bottom: 1px solid #edf2f7; }
            .footer { background-color: #f7fafc; color: #a0aec0; text-align: center; padding: 20px; font-size: 12px; border-top: 1px solid #edf2f7; }
            .button { display: inline-block; padding: 12px 24px; color: #ffffff !important; background-color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; font-size: 14px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>WANDERBEE</h1>
                <p>Royal Heritage Stays & Palaces</p>
            </div>
            <div class="content">
                \${content}
            </div>
            <div class="footer">
                <p>&copy; \${new Date().getFullYear()} WanderBee. All rights reserved.</p>
                <p>You received this email regarding your heritage hotel reservation.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send Booking Confirmation Email
// Send Booking Confirmation Email
export const sendBookingConfirmationEmail = async (userEmail, userName, booking, hotel, room) => {
    try {
        const mailTransporter = await initTransporter();
        const checkInStr = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible';
        const checkOutStr = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible';
        
        const isPaid = booking.isPaid;
        const statusClass = isPaid ? 'status-confirmed' : 'status-pending';
        const statusText = isPaid ? 'Confirmed & Paid' : 'Pending Payment';

        const htmlContent = getHtmlLayout(
            'Booking Confirmation - WanderBee',
            `
            <h2>Pranam \${userName || 'Guest'},</h2>
            <p>Thank you for choosing WanderBee. We are delighted to confirm your reservation at one of our handpicked heritage sanctuaries. Your booking details are summarized below:</p>
            
            <div class="status-badge ${statusClass}">${statusText}</div>

            <table class="details-table">
                <thead>
                    <tr>
                        <th colspan="2">Reservation Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Sanctuary</strong></td>
                        <td>${hotel?.name || 'Heritage Stay'}<br><small style="color:#718096">${hotel?.address || ''}</small></td>
                    </tr>
                    <tr>
                        <td><strong>Suite Type</strong></td>
                        <td>${room?.roomType || 'Luxury Suite'}</td>
                    </tr>
                    <tr>
                        <td><strong>Check-In</strong></td>
                        <td>${checkInStr} (After 12:00 PM)</td>
                    </tr>
                    <tr>
                        <td><strong>Check-Out</strong></td>
                        <td>${checkOutStr} (Before 11:00 AM)</td>
                    </tr>
                    <tr>
                        <td><strong>Guests</strong></td>
                        <td>${booking.guests || 1} Guests</td>
                    </tr>
                    <tr>
                        <td><strong>Total Value</strong></td>
                        <td>₹${(booking.totalPrice || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Method</strong></td>
                        <td>${booking.paymentMethod || 'Pay At Hotel'}</td>
                    </tr>
                    <tr>
                        <td><strong>Cancellation Policy</strong></td>
                        <td>${booking.cancellationPolicy || 'Free Cancellation'}</td>
                    </tr>
                </tbody>
            </table>

            <p>Our Royal Butler and palace concierge are preparing for your arrival to guarantee a memorable stay. If you need any assistance pre-booking dining or requesting upgrades, please visit our Support page.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button">Manage Your Stay</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee Royal" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Reservation Confirmed: \${hotel?.name || 'Heritage Stay'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nYour reservation at ${hotel?.name || 'Heritage Stay'} is received! \nCheck-in: ${checkInStr}\nCheck-out: ${checkOutStr}\nTotal Price: ₹${(booking.totalPrice || 0).toLocaleString()}\nStatus: ${statusText}`,
            html: htmlContent
        });

        console.log(`Email Sent: Booking Confirmation to ${userEmail} [MessageId: ${info.messageId}]`);
        const testUrl = nodemailer.getTestMessageUrl(info);
        if (testUrl) {
            console.log(`✉️ Test Email Live View URL: ${testUrl}`);
        }
    } catch (error) {
        console.error('Error sending booking confirmation email:', error.message);
    }
};

// Send Payment Confirmation Email
export const sendPaymentConfirmationEmail = async (userEmail, userName, booking, hotel, room) => {
    try {
        const mailTransporter = await initTransporter();
        const checkInStr = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible';
        
        const htmlContent = getHtmlLayout(
            'Payment Receipt - WanderBee',
            `
            <h2>Pranam \${userName || 'Guest'},</h2>
            <p>We have successfully processed your payment for your upcoming stay at **${hotel?.name || 'our heritage property'}**. Thank you for securing your booking.</p>
            
            <div class="status-badge status-confirmed">Payment Received</div>

            <table class="details-table">
                <thead>
                    <tr>
                        <th colspan="2">Payment Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Sanctuary</strong></td>
                        <td>${hotel?.name || 'Heritage Stay'}</td>
                    </tr>
                    <tr>
                        <td><strong>Check-In Date</strong></td>
                        <td>${checkInStr}</td>
                    </tr>
                    <tr>
                        <td><strong>Amount Paid</strong></td>
                        <td><strong>₹${(booking.totalPrice || 0).toLocaleString()}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Payment Method</strong></td>
                        <td>${booking.paymentMethod || 'Credit/Debit Card'}</td>
                    </tr>
                    <tr>
                        <td><strong>Status</strong></td>
                        <td>Confirmed & Paid</td>
                    </tr>
                </tbody>
            </table>

            <p>Your booking is now fully secured. We look forward to welcoming you at the palace gate.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button">View Stay Card</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee Royal" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Payment Successful: Stay at \${hotel?.name || 'Heritage Stay'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nWe received your payment of ₹${(booking.totalPrice || 0).toLocaleString()} for your stay at ${hotel?.name || 'Heritage Stay'}. Status: Confirmed & Paid.`,
            html: htmlContent
        });

        console.log(`Email Sent: Payment Receipt to ${userEmail} [MessageId: ${info.messageId}]`);
        const testUrl = nodemailer.getTestMessageUrl(info);
        if (testUrl) {
            console.log(`✉️ Test Email Live View URL: ${testUrl}`);
        }
    } catch (error) {
        console.error('Error sending payment confirmation email:', error.message);
    }
};

// Send Cancellation Confirmation Email
export const sendCancellationEmail = async (userEmail, userName, booking, hotel, room) => {
    try {
        const mailTransporter = await initTransporter();
        const checkInStr = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible';
        
        const htmlContent = getHtmlLayout(
            'Cancellation Confirmation - WanderBee',
            `
            <h2>Pranam \${userName || 'Guest'},</h2>
            <p>This email confirms that your reservation at **${hotel?.name || 'our heritage property'}** has been cancelled as requested.</p>
            
            <div class="status-badge status-cancelled">Cancelled</div>

            <table class="details-table">
                <thead>
                    <tr>
                        <th colspan="2">Cancelled Stay Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Sanctuary</strong></td>
                        <td>${hotel?.name || 'Heritage Stay'}</td>
                    </tr>
                    <tr>
                        <td><strong>Suite Type</strong></td>
                        <td>${room?.roomType || 'Luxury Suite'}</td>
                    </tr>
                    <tr>
                        <td><strong>Original Check-In</strong></td>
                        <td>${checkInStr}</td>
                    </tr>
                    <tr>
                        <td><strong>Cancellation Policy</strong></td>
                        <td>${booking.cancellationPolicy || 'Free Cancellation'}</td>
                    </tr>
                    ${booking.cancellationPolicy === 'Cancellation Fee Applicable' ? `
                    <tr>
                        <td><strong>Cancellation Fee Charged</strong></td>
                        <td>₹${(booking.cancellationFee || (booking.totalPrice * 0.5)).toLocaleString()} (50% Fee)</td>
                    </tr>
                    <tr>
                        <td><strong>Refund Amount</strong></td>
                        <td>₹${(booking.refundAmount || (booking.totalPrice * 0.5)).toLocaleString()}</td>
                    </tr>
                    ` : `
                    <tr>
                        <td><strong>Refund Amount</strong></td>
                        <td>${booking.isPaid ? `₹${booking.totalPrice.toLocaleString()} (Full Refund)` : 'No Fee (Cancelled before Payment / Paid at Hotel)'}</td>
                    </tr>
                    `}
                </tbody>
            </table>

            <p>If a refund is applicable, it will reflect in your account within 5-7 business days. We hope to host you at another of our royal retreats in the near future.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Explore Other Sanctuaries</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee Royal" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Reservation Cancelled: \${hotel?.name || 'Heritage Stay'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nYour reservation at ${hotel?.name || 'Heritage Stay'} checking in on ${checkInStr} has been successfully cancelled.`,
            html: htmlContent
        });

        console.log(`Email Sent: Cancellation Confirmation to ${userEmail} [MessageId: ${info.messageId}]`);
        const testUrl = nodemailer.getTestMessageUrl(info);
        if (testUrl) {
            console.log(`✉️ Test Email Live View URL: ${testUrl}`);
        }
    } catch (error) {
        console.error('Error sending cancellation email:', error.message);
    }
};
