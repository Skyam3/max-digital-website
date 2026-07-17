import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "onboarding@resend.dev";
const CONTACT_INBOX = "kontakt.max.digital@gmail.com";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    !body.name.trim() ||
    !body.email.trim() ||
    !body.message.trim()
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(body.email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();
  const projectType = typeof body.projectType === "string" ? body.projectType.trim() : "";
  const budget = typeof body.budget === "string" ? body.budget.trim() : "";

  const [notification, confirmation] = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        projectType && `Projektart: ${projectType}`,
        budget && `Budget: ${budget}`,
        "",
        "Nachricht:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Deine Nachricht ist angekommen",
      text: `Hallo ${name},\n\ndanke für deine Nachricht — ich melde mich innerhalb eines Werktages bei dir.\n\n— Max`,
    }),
  ]);

  // The notification to Max is the part that actually matters — if it
  // didn't go out, the lead is lost, so this must surface as an error to
  // the visitor (who sees form.error and is told to email directly).
  const notificationError =
    notification.status === "rejected" ? notification.reason : notification.value.error;
  if (notificationError) {
    console.error("Failed to deliver contact form notification:", notificationError);
    return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
  }

  // The auto-reply is a courtesy, not the core function — log and move on
  // rather than telling the visitor their message failed when Max already
  // has it. (Also the one most likely to fail without a verified sending
  // domain, since onboarding@resend.dev can't mail arbitrary recipients.)
  const confirmationError =
    confirmation.status === "rejected" ? confirmation.reason : confirmation.value.error;
  if (confirmationError) {
    console.error("Failed to deliver contact form auto-reply:", confirmationError);
  }

  return NextResponse.json({ ok: true });
}
