import { profile } from "./data";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

// schema.org Person. Only facts that are visible on the page: no invented ratings, awards or images.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Daniel Brooks",
  jobTitle: "Senior Software Engineer",
  description: SITE_DESCRIPTION,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Ashburn", addressRegion: "VA", addressCountry: "US" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of the Punjab" },
  sameAs: [profile.contact.linkedin?.url, profile.contact.github?.url].filter(Boolean),
  knowsAbout: [
    "Software engineering",
    "AI agents",
    "Large language models",
    "Retrieval-augmented generation",
    "Data engineering",
    ".NET",
    "Python",
    "React",
    "Cloud computing",
  ],
  mainEntityOfPage: `${SITE_URL}/`,
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // escape "<" so a string can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
    />
  );
}
