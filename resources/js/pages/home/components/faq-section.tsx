import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/components/ui/disclosure-group";

const faqData = [
  {
    id: 1,
    question: "What is a VPS?",
    answer:
      "A VPS is a Virtual Private Server, which provides dedicated resources on a server shared with other users, offering more control and customization than shared hosting.",
  },
  {
    id: 2,
    question: "What is cloud hosting?",
    answer:
      "Cloud hosting utilizes multiple servers to balance load and maximize uptime. Instead of being hosted on a single server, your data and resources are spread across multiple servers.",
  },
  {
    id: 3,
    question: "What is shared hosting?",
    answer:
      "Shared hosting is a type of web hosting where multiple websites share the same server and its resources. It's an affordable option, but may have limitations on performance and customization.",
  },
  {
    id: 4,
    question: "What is dedicated hosting?",
    answer:
      "Dedicated hosting means your website is hosted on a single server exclusively reserved for your site. This provides maximum performance and customization, but at a higher cost.",
  },
];

const FAQSection = () => {
  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-fg mb-2 uppercase tracking-wider">
            Customer Support
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold">
            Frequently Asked Questions
          </h2>
        </div>
        <DisclosureGroup className="[--disclosure-radius:var(--radius-2xl)] [--disclosure-expanded-bg:var(--color-secondary)]/50 [--disclosure-collapsed-border:transparent] [--disclosure-expanded-border:transparent]">
          {faqData.map((faq) => (
            <Disclosure key={faq.id} id={faq.id}>
              <DisclosureTrigger className={"text-black dark:text-white"}>
                {faq.question}
              </DisclosureTrigger>
              <DisclosurePanel>{faq.answer}</DisclosurePanel>
            </Disclosure>
          ))}
        </DisclosureGroup>
      </div>
    </div>
  );
};

export default FAQSection;
