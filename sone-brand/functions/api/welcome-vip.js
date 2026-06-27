export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const resendApiKey = env.RESEND_API_KEY;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border: 1px solid #1a1a1a; text-align: center;">
        <h1 style="font-size: 32px; letter-spacing: 10px; margin-bottom: 20px;">SONE</h1>
        <h2 style="font-size: 18px; letter-spacing: 2px; color: #10b981; margin-bottom: 30px;">VIP БҮРТГЭЛ БАТАЛГААЖЛАА</h2>
        <p style="color: #ccc; font-size: 14px; line-height: 1.8; margin-bottom: 30px;">
          SONE BRAND-ийн VIP гэр бүлд тавтай морил. <br/>
          Та одооноос эхлэн шинэ коллекцууд, онцгой хямдрал болон <br/>
          Pre-order дуслуудад хамгийн түрүүнд хандах эрхтэй боллоо.
        </p>
        <div style="border-top: 1px solid #222; border-bottom: 1px solid #222; padding: 20px 0; margin-bottom: 30px;">
          <p style="font-size: 12px; color: #666; letter-spacing: 1px; margin: 0;">ТАНЫ ХӨНГӨЛӨЛТИЙН КОД:</p>
          <p style="font-size: 24px; font-weight: bold; color: #fff; margin: 10px 0; letter-spacing: 5px;">SONEVIP10</p>
          <p style="font-size: 10px; color: #444; margin: 0;">*Эхний захиалгадаа 10% хөнгөлөлт эдлээрэй</p>
        </div>
        <a href="https://sone.mn" style="display: inline-block; padding: 15px 40px; background: #fff; color: #000; text-decoration: none; font-weight: bold; font-size: 11px; letter-spacing: 2px; border-radius: 4px;">САЙТ РУУ ҮСРЭХ</a>
        <p style="font-size: 9px; color: #222; margin-top: 60px; letter-spacing: 1px;">
          © 2025 SONE BRAND | ESTABLISHED IN MONGOLIA
        </p>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SONE <onboarding@resend.dev>',
        to: email,
        subject: 'SONE BRAND-д тавтай морил',
        html: htmlContent
      })
    });

    const resendData = await resendRes.json();

    return new Response(JSON.stringify({ message: 'Welcome email sent', data: resendData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
