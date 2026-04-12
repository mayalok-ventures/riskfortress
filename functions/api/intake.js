export async function onRequestPost(context) {
  const body = await context.request.json()
  // Send email via Resend API (recommended) or forward to configured email
  const emailBody = `
    New Consultation Request
    Name: ${body.fullName}
    Org: ${body.organisation}
    Email: ${body.email}
    Phone: ${body.phone || 'Not provided'}
    Risk Category: ${body.riskCategory}
    Asset Value: ${body.assetValue}
    Context: ${body.briefContext || 'Not provided'}
    Referral: ${body.referralSource || 'Not provided'}
  `
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
