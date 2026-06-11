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
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
            body { 
                font-family: 'Inter', sans-serif; 
                background-color: #f9f9fb; 
                color: #1a1c1d; 
                margin: 0; 
                padding: 40px 20px; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: #FFFFFF; 
                border-radius: 24px; 
                overflow: hidden; 
                box-shadow: 0 10px 30px rgba(0, 6, 102, 0.05); 
                border: 1px solid #e8eaf6; 
            }
            .header { 
                background: linear-gradient(135deg, #000666 0%, #1a237e 100%); 
                color: #FFFFFF; 
                padding: 35px 30px; 
                text-align: center; 
                border-bottom: 4px solid #fe9832; 
                position: relative;
            }
            .header h1 { 
                margin: 0; 
                font-family: 'Montserrat', sans-serif; 
                font-size: 28px; 
                font-weight: 800; 
                letter-spacing: 4px; 
                color: #fe9832; 
                text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .content { 
                padding: 40px 35px; 
                line-height: 1.7; 
                font-size: 15px;
            }
            .content h2 {
                font-family: 'Montserrat', sans-serif;
                font-size: 20px;
                color: #000666;
                margin-top: 0;
                margin-bottom: 15px;
                font-weight: 700;
            }
            .status-badge { 
                display: inline-block; 
                padding: 8px 20px; 
                border-radius: 50px; 
                font-size: 11px; 
                font-weight: 700; 
                text-transform: uppercase; 
                margin-bottom: 25px; 
                letter-spacing: 1.5px; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.02);
            }
            .status-confirmed { 
                background-color: #ecfdf5; 
                color: #065f46; 
                border: 1px solid #a7f3d0; 
            }
            .status-cancelled { 
                background-color: #fef2f2; 
                color: #991b1b; 
                border: 1px solid #fca5a5; 
            }
            .status-pending { 
                background-color: #fffbeb; 
                color: #92400e; 
                border: 1px solid #fde68a; 
            }
            .details-card {
                background-color: #f9f9fb;
                border: 1px solid #e8eaf6;
                border-radius: 16px;
                padding: 25px;
                margin: 25px 0;
            }
            .details-card-title {
                font-family: 'Montserrat', sans-serif;
                font-size: 13px;
                color: #8f4e00;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 15px;
                font-weight: 700;
                border-bottom: 1px solid #e8eaf6;
                padding-bottom: 8px;
            }
            .details-row {
                display: table;
                width: 100%;
                margin-bottom: 12px;
                font-size: 14px;
            }
            .details-label {
                display: table-cell;
                width: 35%;
                font-weight: 600;
                color: #5c6bc0;
                padding-right: 10px;
            }
            .details-value {
                display: table-cell;
                width: 65%;
                color: #1a1c1d;
                font-weight: 500;
            }
            .details-value strong {
                color: #000666;
            }
            .footer { 
                background-color: #f9f9fb; 
                color: #8f4e00; 
                text-align: center; 
                padding: 30px 20px; 
                font-size: 12px; 
                border-top: 1px solid #e8eaf6; 
            }
            .footer p {
                margin: 5px 0;
            }
            .button { 
                display: inline-block; 
                padding: 14px 30px; 
                color: #FFFFFF !important; 
                background: linear-gradient(135deg, #8f4e00 0%, #fe9832 100%); 
                text-decoration: none; 
                border-radius: 50px; 
                font-weight: 700; 
                font-size: 13px; 
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-top: 25px; 
                box-shadow: 0 4px 15px rgba(143, 78, 0, 0.25);
                border: 1px solid #8f4e00;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>WANDERBEE</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} WanderBee. All rights reserved.</p>
                <p style="font-size: 10px; color: #A89F91; margin-top: 10px;">You received this email regarding your booking.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

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
            <h2>Pranam ${userName || 'Guest'},</h2>
            <p>Thank you for choosing WanderBee. We are delighted to confirm your reservation at one of our handpicked premium hotels. Your booking details are summarized below:</p>
            
            <div class="status-badge ${statusClass}">${statusText}</div>

            <div class="details-card">
                <div class="details-card-title">Reservation Details</div>
                <div class="details-row">
                    <div class="details-label">Hotel</div>
                    <div class="details-value"><strong>${hotel?.name || 'Hotel Stay'}</strong><br><span style="font-size:12px; color:#7F7F7F;">${hotel?.address || ''}</span></div>
                </div>
                <div class="details-row">
                    <div class="details-label">Suite Type</div>
                    <div class="details-value">${room?.roomType || 'Luxury Suite'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Check-In</div>
                    <div class="details-value">${checkInStr} (After 12:00 PM)</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Check-Out</div>
                    <div class="details-value">${checkOutStr} (Before 11:00 AM)</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Guests</div>
                    <div class="details-value">${booking.guests || 1} Guests</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Total Value</div>
                    <div class="details-value" style="color:#3D0C11; font-weight:700;">₹${(booking.totalPrice || 0).toLocaleString()}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Payment Method</div>
                    <div class="details-value">${booking.paymentMethod || 'Pay At Hotel'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Cancellation Policy</div>
                    <div class="details-value">${booking.cancellationPolicy || 'Free Cancellation'}</div>
                </div>
            </div>

            <p>Our team and hotel staff are preparing for your arrival to guarantee a memorable stay. If you need any assistance pre-booking dining or requesting upgrades, please visit our Support page.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button">Manage Your Stay</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Reservation Confirmed: ${hotel?.name || 'Stay'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nYour reservation at ${hotel?.name || 'Stay'} is received! \nCheck-in: ${checkInStr}\nCheck-out: ${checkOutStr}\nTotal Price: ₹${(booking.totalPrice || 0).toLocaleString()}\nStatus: ${statusText}`,
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
            <h2>Pranam ${userName || 'Guest'},</h2>
            <p>We have successfully processed your payment for your upcoming stay at **${hotel?.name || 'our property'}**. Thank you for securing your booking.</p>
            
            <div class="status-badge status-confirmed">Payment Received</div>

            <div class="details-card">
                <div class="details-card-title">Payment Summary</div>
                <div class="details-row">
                    <div class="details-label">Hotel</div>
                    <div class="details-value"><strong>${hotel?.name || 'Hotel Stay'}</strong></div>
                </div>
                <div class="details-row">
                    <div class="details-label">Check-In Date</div>
                    <div class="details-value">${checkInStr}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Amount Paid</div>
                    <div class="details-value" style="color:#3D0C11; font-weight:700;">₹${(booking.totalPrice || 0).toLocaleString()}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Payment Method</div>
                    <div class="details-value">${booking.paymentMethod || 'Credit/Debit Card'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Status</div>
                    <div class="details-value" style="color:#137333; font-weight:700;">Confirmed & Paid</div>
                </div>
            </div>

            <p>Your booking is now fully secured. We look forward to welcoming you to your stay.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button">View Stay Card</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Payment Successful: Stay at ${hotel?.name || 'Hotel Stay'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nWe received your payment of ₹${(booking.totalPrice || 0).toLocaleString()} for your stay at ${hotel?.name || 'Hotel Stay'}. Status: Confirmed & Paid.`,
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
            <h2>Pranam ${userName || 'Guest'},</h2>
            <p>This email confirms that your reservation at **${hotel?.name || 'our property'}** has been cancelled as requested.</p>
            
            <div class="status-badge status-cancelled">Cancelled</div>

            <div class="details-card">
                <div class="details-card-title">Cancelled Stay Details</div>
                <div class="details-row">
                    <div class="details-label">Hotel</div>
                    <div class="details-value"><strong>${hotel?.name || 'Hotel Stay'}</strong></div>
                </div>
                <div class="details-row">
                    <div class="details-label">Suite Type</div>
                    <div class="details-value">${room?.roomType || 'Luxury Suite'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Original Check-In</div>
                    <div class="details-value">${checkInStr}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Cancellation Policy</div>
                    <div class="details-value">${booking.cancellationPolicy || 'Free Cancellation'}</div>
                </div>
                ${booking.cancellationPolicy === 'Cancellation Fee Applicable' ? `
                <div class="details-row">
                    <div class="details-label">Cancellation Fee</div>
                    <div class="details-value" style="color:#C5221F;">₹${(booking.cancellationFee || (booking.totalPrice * 0.5)).toLocaleString()} (50% Fee)</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Refund Amount</div>
                    <div class="details-value" style="color:#137333; font-weight:700;">₹${(booking.refundAmount || (booking.totalPrice * 0.5)).toLocaleString()}</div>
                </div>
                ` : `
                <div class="details-row">
                    <div class="details-label">Refund Amount</div>
                    <div class="details-value" style="color:#137333; font-weight:700;">${booking.isPaid ? `₹${booking.totalPrice.toLocaleString()} (Full Refund)` : 'No Fee (Cancelled before Payment)'}</div>
                </div>
                `}
            </div>

            <p>If a refund is applicable, it will reflect in your account within 5-7 business days. We hope to host you at another of our properties in the near future.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Explore Other Hotels</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Reservation Cancelled: ${hotel?.name || 'Hotel Stay'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nYour reservation at ${hotel?.name || 'Hotel Stay'} checking in on ${checkInStr} has been successfully cancelled.`,
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

// Send Experience Booking Confirmation/Payment Email
export const sendExperienceBookingEmail = async (userEmail, userName, booking, experience) => {
    try {
        const mailTransporter = await initTransporter();
        const dateStr = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible';
        
        const isPaid = booking.isPaid;
        const statusClass = isPaid ? 'status-confirmed' : 'status-pending';
        const statusText = isPaid ? 'Confirmed & Paid' : 'Pending Payment';

        const htmlContent = getHtmlLayout(
            'Experience Booking Confirmation - WanderBee',
            `
            <h2>Pranam ${userName || 'Guest'},</h2>
            <p>Thank you for booking a WanderBee Curated Experience. We are delighted to confirm your experience reservation. Your booking details are summarized below:</p>
            
            <div class="status-badge ${statusClass}">${statusText}</div>

            <div class="details-card">
                <div class="details-card-title">Experience Details</div>
                <div class="details-row">
                    <div class="details-label">Experience</div>
                    <div class="details-value"><strong>${experience?.title || 'Experience'}</strong><br><span style="font-size:12px; color:#7F7F7F;">${experience?.location || ''}</span></div>
                </div>
                <div class="details-row">
                    <div class="details-label">Category</div>
                    <div class="details-value">${experience?.category || 'Curated'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Date</div>
                    <div class="details-value">${dateStr}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Timing</div>
                    <div class="details-value">${experience?.timing || 'As scheduled'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Duration</div>
                    <div class="details-value">${experience?.duration || 'Flexible'}</div>
                </div>
                <div class="details-row">
                    <div class="details-label">People</div>
                    <div class="details-value">${booking.guests || 1} Person(s)</div>
                </div>
                <div class="details-row">
                    <div class="details-label">Total Value</div>
                    <div class="details-value" style="color:#3D0C11; font-weight:700;">₹${(booking.totalPrice || 0).toLocaleString()} <span style="font-size:10px; font-weight:normal; color:#7F7F7F;">(inc. 5% GST)</span></div>
                </div>
                <div class="details-row">
                    <div class="details-label">Payment Method</div>
                    <div class="details-value">${booking.paymentMethod || 'Credit/Debit Card'}</div>
                </div>
            </div>

            <p>Our experience guide and coordinators are preparing for your arrival. If you have any coordination requests, please contact our Support page.</p>
            
            <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button">Manage Your Experience</a>
            </center>
            `
        );

        const info = await mailTransporter.sendMail({
            from: '"WanderBee" <no-reply@wanderbee.com>',
            to: userEmail,
            subject: `Experience Confirmed: ${experience?.title || 'Experience'} - WanderBee`,
            text: `Pranam ${userName || 'Guest'},\n\nYour experience booking for "${experience?.title || 'Experience'}" is confirmed!\nDate: ${dateStr}\nGuests: ${booking.guests}\nTotal Price: ₹${(booking.totalPrice || 0).toLocaleString()}\nStatus: ${statusText}`,
            html: htmlContent
        });

        console.log(`Email Sent: Experience Confirmation to ${userEmail} [MessageId: ${info.messageId}]`);
        const testUrl = nodemailer.getTestMessageUrl(info);
        if (testUrl) {
            console.log(`✉️ Test Email Live View URL: ${testUrl}`);
        }
    } catch (error) {
        console.error('Error sending experience booking email:', error.message);
    }
};
