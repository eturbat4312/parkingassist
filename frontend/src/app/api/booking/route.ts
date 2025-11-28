import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // 1. Frontend-ээс ирсэн мэдээллийг хүлээж авах
    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      city, 
      postalCode, 
      address, 
      reason, 
      numberOfSpots, 
      requiredLength, // Таны frontend дээр нэмсэн талбар
      startDate, 
      startTime, 
      endDate, 
      endTime, 
      vehicleDescription, 
      locale // Хэлний сонголт (fr эсвэл en)
    } = body;

    // 2. KreativMedia (SMTP) тохиргоог холбох
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // mail.park-assist.ch
      port: Number(process.env.SMTP_PORT), // 465
      secure: true, // 465 port дээр true байх ёстой
      auth: {
        user: process.env.SMTP_USER, // info@park-assist.ch
        pass: process.env.SMTP_PASS, // Таны нууц үг
      },
    });

    // Шалгах: SMTP холболт зөв эсэх
    try {
      await transporter.verify();
      console.log("SMTP connection success");
    } catch (verifyError) {
      console.error("SMTP connection failed:", verifyError);
      return NextResponse.json({ error: "SMTP configuration error" }, { status: 500 });
    }

    // ------------------------------------------
    // ИМЭЙЛ 1: АДМИН РУУ (info@park-assist.ch руу)
    // ------------------------------------------
    
    // Reason array-г стринг болгох
    const reasonText = Array.isArray(reason) ? reason.join(', ') : reason;

    const adminMailContent = `
      <h2>New Booking Request</h2>
      <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
      <hr />
      <h3>Address Details</h3>
      <p>${address}, ${postalCode} ${city}</p>
      <hr />
      <h3>Reservation Details</h3>
      <p><strong>Start:</strong> ${startDate} at ${startTime}</p>
      <p><strong>End:</strong> ${endDate} at ${endTime}</p>
      <p><strong>Reason:</strong> ${reasonText}</p>
      <p><strong>Spots:</strong> ${numberOfSpots}</p>
      <p><strong>Required Length:</strong> ${requiredLength || "Not specified"} m</p>
      <p><strong>Vehicle:</strong> ${vehicleDescription}</p>
    `;

    await transporter.sendMail({
      from: `"Park Assist Website" <${process.env.SMTP_USER}>`, // Илгээгч
      to: process.env.SMTP_USER, // Хүлээн авагч (өөрсдөө)
      replyTo: email, // Reply дарахад хэрэглэгч рүү бичнэ
      subject: `New Booking: ${firstName} ${lastName} (${city})`,
      html: adminMailContent,
    });

    // ------------------------------------------
    // ИМЭЙЛ 2: ХЭРЭГЛЭГЧ РҮҮ (Auto Reply)
    // ------------------------------------------
    
    const isFr = locale === 'fr';
    const userSubject = isFr 
      ? "Confirmation de votre demande - Park Assist"
      : "Booking Request Received - Park Assist";

    const userMessage = isFr 
      ? `
        <p>Bonjour ${firstName},</p>
        <p>Nous avons bien reçu votre demande de réservation de stationnement.</p>
        <p>Notre équipe va traiter votre demande et vous contactera dans les plus brefs délais pour confirmation.</p>
        <br>
        <p><strong>Détails:</strong></p>
        <ul>
          <li>Adresse: ${address}, ${city}</li>
          <li>Date: Du ${startDate} au ${endDate}</li>
        </ul>
        <br>
        <p>Cordialement,<br>L'équipe Park Assist</p>
      ` 
      : `
        <p>Hello ${firstName},</p>
        <p>We have received your parking reservation request.</p>
        <p>Our team will process your request and contact you shortly for confirmation.</p>
        <br>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Address: ${address}, ${city}</li>
          <li>Date: From ${startDate} to ${endDate}</li>
        </ul>
        <br>
        <p>Best regards,<br>Park Assist Team</p>
      `;

    await transporter.sendMail({
      from: `"Park Assist" <${process.env.SMTP_USER}>`,
      to: email, // Хэрэглэгчийн имэйл
      subject: userSubject,
      html: userMessage,
    });

    return NextResponse.json({ success: true, message: "Emails sent successfully" });

  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}