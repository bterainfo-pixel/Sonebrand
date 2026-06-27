import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!product) {
      return NextResponse.json({ error: 'Product data is required' }, { status: 400 });
    }

    // 1. Fetch all subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscriptions')
      .select('email');

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
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

    // 3. Send Emails via Resend (Batch sending if possible, or loop)
    // Resend free tier might have limits, so we send in one go if list is small
    const { data, error } = await resend.emails.send({
      from: 'SONE <onboarding@resend.dev>', // Replace with your verified domain in production
      to: emails,
      subject: `ШИНЭ БАРАА: ${product.name}`,
      html: htmlContent,
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Notifications sent successfully', data });
  } catch (error: any) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
