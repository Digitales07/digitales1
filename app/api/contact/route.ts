import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firebaseConfigSource, firebaseProjectId } from "@/lib/firebase";
import ContactFormEmail from "@/emails/ContactFormEmail";
import InternalContactLeadEmail from "@/emails/InternalContactLeadEmail";
import { emailLogoBase64, emailLogoCid } from "@/emails/emailBrand";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  services?: unknown;
  service?: unknown;
  message?: unknown;
  sourceDomain?: unknown;
};

type ContactData = {
  name: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
  sourceDomain: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactPayload(body: ContactPayload): { error: string } | { data: ContactData } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sourceDomain = typeof body.sourceDomain === "string" ? body.sourceDomain.trim().toLowerCase() : "";

  const services = Array.isArray(body.services)
    ? body.services
        .filter((service): service is string => typeof service === "string")
        .map((service) => service.trim())
        .filter(Boolean)
    : typeof body.services === "string" && body.services.trim()
      ? [body.services.trim()]
      : typeof body.service === "string" && body.service.trim()
        ? [body.service.trim()]
        : [];

  if (!name) {
    return { error: "Name is required" };
  }

  if (!email) {
    return { error: "Email is required" };
  }

  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address" };
  }

  if (!message) {
    return { error: "Message is required" };
  }

  return {
    data: {
      name,
      email,
      phone: phone || "Not provided",
      services: services.length ? services : ["Not specified"],
      message,
      sourceDomain: sourceDomain || "unknown",
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = validateContactPayload(body);

    if ("error" in validated) {
      return NextResponse.json(
        { ok: false, error: validated.error },
        { status: 400 }
      );
    }

    try {
      await addDoc(collection(db, "contacts"), {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        services: validated.data.services,
        message: validated.data.message,
        sourceDomain: validated.data.sourceDomain,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("CONTACT_FIRESTORE_SAVE_ERROR:", {
        firebaseConfigSource,
        firebaseProjectId,
        error,
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    try {
      const internalEmailResult = await resend.emails.send({
        from: "info@digitales.pk",
        to: "shaheerulazeem@gmail.com",
        subject: "New Business Lead: Contact Form Submission",
        react: InternalContactLeadEmail(validated.data),
        attachments: [
          {
            filename: "digitales-logo.png",
            content: emailLogoBase64,
            contentType: "image/png",
            contentId: emailLogoCid,
          },
        ],
      });

      if (internalEmailResult.error) {
        throw internalEmailResult.error;
      }

      console.log("CONTACT_INTERNAL_EMAIL_SENT:", internalEmailResult.data?.id);

      try {
        const autoResponderResult = await resend.emails.send({
          from: "info@digitales.pk",
          to: validated.data.email,
          subject: "We've received your request - Digitales",
          react: ContactFormEmail(validated.data),
          attachments: [
            {
              filename: "digitales-logo.png",
              content: emailLogoBase64,
              contentType: "image/png",
              contentId: emailLogoCid,
            },
          ],
        });

        if (autoResponderResult.error) {
          console.error("CONTACT_AUTORESPONDER_ERROR:", autoResponderResult.error);
        } else {
          console.log("CONTACT_AUTORESPONDER_SENT:", autoResponderResult.data?.id);
        }
      } catch (error) {
        console.error("CONTACT_AUTORESPONDER_ERROR:", error);
      }

      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
      console.error("CONTACT_INTERNAL_EMAIL_ERROR:", error);
      return NextResponse.json(
        { ok: false, error: "Contact message could not be processed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("CONTACT_PIPELINE_ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected contact form error" },
      { status: 500 }
    );
  }
}
