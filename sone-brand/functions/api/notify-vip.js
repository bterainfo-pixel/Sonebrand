export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { product } = await request.json();

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product data is required' }), { status: 400 });
    }

    // 1. Fetch all subscribers from Supabase
    // We need to use env variables from Cloudflare
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const resendApiKey = env.RESEND_API_KEY;

    const subResponse = await fetch(`${supabaseUrl}/rest/v1/subscriptions?select=email`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const subscribers = await subResponse.json();

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscribers found' }), { status: 200 });
    }

    const emails = subscribers.map((s) => s.email);

    // 2. Prepare Email Content
    const salePrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
    const discountText = product.discount > 0 ? `(${product.discount}% ХЯМДРАЛ)` : '';

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border: 1px solid #1a1a1a;">
        <h1 style="font-size: 24px; letter-spacing: 5px; text-align: center; margin-bottom: 40px;">SONE</h1>
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${product.images[0]}" alt="${product.name}" style="width: 100%; max-width: 400px; border-radius: 4px;" />
        </div>
        <h2 style="font-size: 20px; letter-spacing: 1px; margin-bottom: 10px;">${product.name}</h2>
        <p style="color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">${product.description || 'Шинэ загвар худалдаанд гарлаа.'}</p>
        <div style="background: #111; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 12px; color: #666; letter-spacing: 1px;">ҮНЭ</p>
          <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #10b981;">
            ${salePrice.toLocaleString()}₮ 
            <span style="font-size: 14px; color: #ef4444; font-weight: normal; margin-left: 10px;">${discountText}</span>
          </p>
          ${product.discount > 0 ? `<p style="margin: 5px 0 0; font-size: 14px; color: #444; text-decoration: line-through;">${product.price.toLocaleString()}₮</p>` : ''}
        </div>
        <a href="https://sone.mn/product/${product.id}" style="display: block; width: 100%; padding: 15px; background: #fff; color: #000; text-decoration: none; text-align: center; font-weight: bold; font-size: 13px; letter-spacing: 2px; border-radius: 4px;">ОДОО ҮЗЭХ</a>
        <p style="font-size: 10px; color: #333; text-align: center; margin-top: 40px;">
          Та энэхүү мэйлийг SONE VIP гишүүн тул хүлээн авч байна.<br/>
          © 2025 SONE BRAND
        </p>
      </div>
    `;

    // 3. Send Email via Resend REST API
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SONE <onboarding@resend.dev>',
        to: emails,
        subject: `ШИНЭ БАРАА: ${product.name}`,
        html: htmlContent
      })
    });

    const resendData = await resendRes.json();

    return new Response(JSON.stringify({ message: 'Notifications sent', data: resendData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
