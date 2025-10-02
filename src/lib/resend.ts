// Resend email configuration
// This is primarily used in the serverless API endpoint

export const emailConfig = {
  from: 'CAPRA Website <noreply@capra.pk>',
  to: 'info@capra.pk',
  replyTo: '',
};

export const formatContactEmail = (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product?: string;
  message: string;
}) => {
  return {
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
          <p><strong>Product Interest:</strong> ${data.product || 'N/A'}</p>
        </div>
        <div style="margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    `,
  };
};
