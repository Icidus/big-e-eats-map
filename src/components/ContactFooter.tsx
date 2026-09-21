import { Mail } from "lucide-react";

export function ContactFooter({ email }: { email: string }) {
  const contactUrl = `mailto:${email}?subject=${encodeURIComponent("Big E Eats — listing question")}`;

  return (
    <footer className="border-t-2 border-primary/20 bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-bold text-primary">Help keep Big E Eats accurate</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Vendor update, correction, or removal request? Include the listing name or page link and what you’d like changed.
          </p>
        </div>
        <a
          href={contactUrl}
          className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Contact us
        </a>
      </div>
    </footer>
  );
}
