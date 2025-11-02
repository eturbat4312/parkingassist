// filename: src/app/api/booking/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type BookingPayload = {
  locale: "fr" | "en";
  firstName: string;
  lastName: string;
  company?: string;
  city: string;
  postalCode: string;
  address: string;
  email: string;
  phone: string;
  reason: string[];
  numberOfSpots: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  vehicleDescription: string;
};

function buildHtml(payload: BookingPayload) {
  const lines = [
    `<h2>Parking reservation request</h2>`,
    `<p><b>Name:</b> ${payload.firstName} ${payload.lastName}</p>`,
    payload.company ? `<p><b>Company:</b> ${payload.company}</p>` : "",
    `<p><b>City / Postal:</b> ${payload.city} ${payload.postalCode}</p>`,
    `<p><b>Address:</b> ${payload.address}</p>`,
    `<p><b>Email / Phone:</b> ${payload.email} / ${payload.phone}</p>`,
    `<p><b>Reason:</b> ${payload.reason?.join(", ") || "-"}</p>`,
    `<p><b>Spots:</b> ${payload.numberOfSpots}</p>`,
    `<p><b>From:</b> ${payload.startDate} ${payload.startTime}</p>`,
    `<p><b>To:</b> ${payload.endDate} ${payload.endTime}</p>`,
    `<p><b>Vehicle:</b> ${payload.vehicleDescription}</p>`,
  ].join("");
  return `<!doctype html><html><body>${lines}</body></html>`;
}

async function makeTransport(opts: {
  port: number;
  secure: boolean;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: opts.port,
    secure: opts.secure, // 465=true, 587=false (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    requireTLS: !opts.secure, // STARTTLS дээр TLS шаард
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    tls: {
      servername: "smtp.gmail.com",
    },
  });

  // холбоо тогтож байна уу гэж урьдчилж шалгана
  await transporter.verify();
  return transporter;
}

export async function POST(req: Request) {
  let payload: BookingPayload;

  try {
    payload = (await req.json()) as BookingPayload;
  } catch (e) {
    console.error("Booking API: invalid JSON", e);
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const admin = process.env.ADMIN_EMAIL!;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;

  const subjectAdmin = `New parking reservation — ${payload.firstName} ${payload.lastName}`;
  const subjectUser =
    payload.locale === "fr"
      ? "Nous avons bien reçu votre demande de réservation"
      : "We have received your reservation request";

  const html = buildHtml(payload);

  try {
    // --- 1) Try 587 STARTTLS
    try {
      const tx587 = await makeTransport({ port: 587, secure: false });
      await tx587.sendMail({
        from,
        to: admin,
        replyTo: payload.email,
        subject: subjectAdmin,
        html,
      });
      await tx587.sendMail({
        from,
        to: payload.email,
        subject: subjectUser,
        html:
          payload.locale === "fr"
            ? `<p>Merci ! Nous avons bien reçu votre demande. Nous la traitons et vous recontacterons très prochainement.</p><p>Si vous avez des questions, contactez-nous au téléphone ou par e-mail en réponse à ce message.</p>`
            : `<p>Thank you! We’ve received your request. We’re processing it and will contact you shortly.</p><p>If you have questions, call us or reply to this email.</p>`,
      });
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      console.warn("Booking API: 587 failed, falling back to 465", e?.message || e);
    }

    // --- 2) Fallback 465 SSL/TLS
    const tx465 = await makeTransport({ port: 465, secure: true });
    await tx465.sendMail({
      from,
      to: admin,
      replyTo: payload.email,
      subject: subjectAdmin,
      html,
    });
    await tx465.sendMail({
      from,
      to: payload.email,
      subject: subjectUser,
      html:
        payload.locale === "fr"
          ? `<p>Merci ! Nous avons bien reçu votre demande. Nous la traitons et vous recontacterons très prochainement.</p><p>Si vous avez des questions, contactez-nous au téléphone ou par e-mail en réponse à ce message.</p>`
          : `<p>Thank you! We’ve received your request. We’re processing it and will contact you shortly.</p><p>If you have questions, call us or reply to this email.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Booking API error:", err);
    const code = err?.code || err?.responseCode || "send_error";
    return NextResponse.json({ ok: false, error: String(code) }, { status: 500 });
  }
}
