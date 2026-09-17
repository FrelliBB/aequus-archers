import type { APIContext } from "astro";
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage, Mailbox } from "mimetext";

// Runs on-demand in the Worker (not prerendered).
export const prerender = false;

export async function POST({ request, locals, redirect }: APIContext) {
	try {
		const env = (locals as any).runtime.env;
		const data = await request.formData();

		// Honeypot: bots fill this hidden field. Pretend success and drop it.
		if (data.get("botcheck")) return redirect("/thank-you", 303);

		const name = String(data.get("name") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const message = String(data.get("message") ?? "").trim();

		if (!name || !email || !message) return redirect("/contact?error=1", 303);

		// Log to D1 first (best-effort) so we keep a record even if the email send fails.
		// If the DB binding isn't configured yet, this is skipped and the form still works.
		try {
			await env.DB?.prepare(
				"INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
			)
				.bind(name, email, message)
				.run();
		} catch (logErr) {
			console.error("Contact log (D1) failed:", logErr);
		}

		const from = env.CONTACT_FROM as string;
		const to = env.CONTACT_TO as string;

		const msg = createMimeMessage();
		msg.setSender({ name: "Aequus Archers website", addr: from });
		msg.setRecipient(to);
		msg.setSubject(`New website enquiry from ${name}`);
		// Reply-To must be a Mailbox instance; skip it if the address is malformed.
		try {
			msg.setHeader("Reply-To", new Mailbox(email));
		} catch {
			/* leave Reply-To unset; the sender's email is still in the body */
		}
		const esc = (s: string) =>
			s.replace(
				/[&<>"]/g,
				(c) =>
					({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
			);
		// Reply opens addressed to the enquirer with a matching subject. No CC:
		// submissions land in the tawk.to ticket inbox, and CC'ing its intake
		// address from a reply would open a duplicate ticket.
		const replyHref =
			`mailto:${email}` +
			`?subject=${encodeURIComponent("Re: New website enquiry from " + name)}`;

		// Plain-text part (fallback) — the enquirer's address is clearly shown.
		msg.addMessage({
			contentType: "text/plain",
			data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nReply to ${name}: ${email}\n`,
		});
		// HTML part — one-click "Reply to <name>" as a fallback for anyone reading
		// the raw email; replying from the tawk.to dashboard is the normal route.
		msg.addMessage({
			contentType: "text/html",
			data:
				`<p style="font-family:sans-serif"><strong>Name:</strong> ${esc(name)}<br>` +
				`<strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` +
				`<p style="font-family:sans-serif"><strong>Message:</strong><br>${esc(message).replace(/\n/g, "<br>")}</p>` +
				`<p style="margin-top:18px"><a href="${esc(replyHref)}" ` +
				`style="display:inline-block;background:#d4271a;color:#ffffff;text-decoration:none;` +
				`font-weight:bold;padding:10px 18px;border-radius:8px;font-family:sans-serif">` +
				`Reply to ${esc(name)}</a></p>` +
				`<p style="font-size:12px;color:#888888;font-family:sans-serif">` +
				`Opens a direct email reply to ${esc(name)}. Prefer replying from the tawk.to dashboard so the conversation stays on the ticket.</p>`,
		});

		await env.SEND_EMAIL.send(new EmailMessage(from, to, msg.asRaw()));
		return redirect("/thank-you", 303);
	} catch (err) {
		console.error("Contact form error:", err);
		return redirect("/contact?error=1", 303);
	}
}
