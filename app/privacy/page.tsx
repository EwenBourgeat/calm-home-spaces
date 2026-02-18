import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Learn how Calm Home Spaces collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen">
            {/* Back navigation */}
            <div className="pt-24 pb-4 px-4">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Link>
                </div>
            </div>

            {/* Content */}
            <article className="px-4 pb-24">
                <div className="mx-auto max-w-3xl">
                    {/* Page title */}
                    <header className="mb-12">
                        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
                            Privacy Policy
                        </h1>
                        <p className="mt-4 text-stone-400 text-sm">
                            Last updated: January 23, 2026
                        </p>
                        <div className="mt-6 w-12 h-px bg-stone-300" />
                    </header>

                    {/* Prose body */}
                    <div className="prose-policy space-y-8 text-stone-600 leading-relaxed text-[15px]">
                        <p>
                            This Privacy Policy describes Our policies and procedures on the
                            collection, use and disclosure of Your information when You use
                            the Service and tells You about Your privacy rights and how the
                            law protects You.
                        </p>
                        <p>
                            We use Your Personal Data to provide and improve the Service. By
                            using the Service, You agree to the collection and use of
                            information in accordance with this Privacy Policy. This Privacy
                            Policy has been created with the help of the{" "}
                            <a
                                href="https://www.termsfeed.com/privacy-policy-generator/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-stone-800 underline underline-offset-2 hover:text-forest transition-colors"
                            >
                                Privacy Policy Generator
                            </a>
                            .
                        </p>

                        {/* ==========================================
                Interpretation and Definitions
                ========================================== */}
                        <Section title="Interpretation and Definitions">
                            <SubSection title="Interpretation">
                                <p>
                                    The words whose initial letters are capitalized have meanings
                                    defined under the following conditions. The following
                                    definitions shall have the same meaning regardless of whether
                                    they appear in singular or in plural.
                                </p>
                            </SubSection>

                            <SubSection title="Definitions">
                                <p>For the purposes of this Privacy Policy:</p>
                                <DefinitionList
                                    items={[
                                        {
                                            term: "Account",
                                            definition:
                                                "means a unique account created for You to access our Service or parts of our Service.",
                                        },
                                        {
                                            term: "Affiliate",
                                            definition:
                                                'means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                                        },
                                        {
                                            term: "Company",
                                            definition:
                                                '(referred to as either "the Company", "We", "Us" or "Our" in this Privacy Policy) refers to Calm Home Spaces.',
                                        },
                                        {
                                            term: "Cookies",
                                            definition:
                                                "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                                        },
                                        {
                                            term: "Country",
                                            definition: "refers to: France.",
                                        },
                                        {
                                            term: "Device",
                                            definition:
                                                "means any device that can access the Service such as a computer, a cell phone or a digital tablet.",
                                        },
                                        {
                                            term: "Personal Data",
                                            definition:
                                                '(or "Personal Information") is any information that relates to an identified or identifiable individual. We use "Personal Data" and "Personal Information" interchangeably unless a law uses a specific term.',
                                        },
                                        {
                                            term: "Service",
                                            definition: "refers to the Website.",
                                        },
                                        {
                                            term: "Service Provider",
                                            definition:
                                                "means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.",
                                        },
                                        {
                                            term: "Usage Data",
                                            definition:
                                                "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
                                        },
                                        {
                                            term: "Website",
                                            definition: (
                                                <>
                                                    refers to Calm Home Spaces, accessible from{" "}
                                                    <a
                                                        href="https://calmhomespaces.vercel.app"
                                                        className="text-stone-800 underline underline-offset-2 hover:text-forest transition-colors"
                                                    >
                                                        https://calmhomespaces.vercel.app
                                                    </a>
                                                    .
                                                </>
                                            ),
                                        },
                                        {
                                            term: "You",
                                            definition:
                                                "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                                        },
                                    ]}
                                />
                            </SubSection>
                        </Section>

                        {/* ==========================================
                Collecting and Using Your Personal Data
                ========================================== */}
                        <Section title="Collecting and Using Your Personal Data">
                            <SubSection title="Types of Data Collected">
                                <h4 className="font-serif text-lg text-stone-800 mt-6 mb-2">
                                    Personal Data
                                </h4>
                                <p>
                                    While using Our Service, We may ask You to provide Us with
                                    certain personally identifiable information that can be used to
                                    contact or identify You. Personally identifiable information
                                    may include, but is not limited to:
                                </p>

                                <h4 className="font-serif text-lg text-stone-800 mt-6 mb-2">
                                    Usage Data
                                </h4>
                                <p>
                                    Usage Data is collected automatically when using the Service.
                                </p>
                                <p>
                                    Usage Data may include information such as Your Device&apos;s
                                    Internet Protocol address (e.g. IP address), browser type,
                                    browser version, the pages of our Service that You visit, the
                                    time and date of Your visit, the time spent on those pages,
                                    unique device identifiers and other diagnostic data.
                                </p>
                                <p>
                                    When You access the Service by or through a mobile device, We
                                    may collect certain information automatically, including, but
                                    not limited to, the type of mobile device You use, Your mobile
                                    device&apos;s unique ID, the IP address of Your mobile device,
                                    Your mobile operating system, the type of mobile Internet
                                    browser You use, unique device identifiers and other diagnostic
                                    data.
                                </p>
                                <p>
                                    We may also collect information that Your browser sends
                                    whenever You visit Our Service or when You access the Service
                                    by or through a mobile device.
                                </p>

                                <h4 className="font-serif text-lg text-stone-800 mt-6 mb-2">
                                    Tracking Technologies and Cookies
                                </h4>
                                <p>
                                    We use Cookies and similar tracking technologies to track the
                                    activity on Our Service and store certain information. Tracking
                                    technologies We use include beacons, tags, and scripts to
                                    collect and track information and to improve and analyze Our
                                    Service. The technologies We use may include:
                                </p>
                                <BulletList
                                    items={[
                                        <>
                                            <strong>Cookies or Browser Cookies.</strong> A cookie is a
                                            small file placed on Your Device. You can instruct Your
                                            browser to refuse all Cookies or to indicate when a cookie
                                            is being sent. However, if You do not accept Cookies, You
                                            may not be able to use some parts of our Service.
                                        </>,
                                        <>
                                            <strong>Web Beacons.</strong> Certain sections of our
                                            Service and our emails may contain small electronic files
                                            known as web beacons (also referred to as clear gifs, pixel
                                            tags, and single-pixel gifs) that permit the Company, for
                                            example, to count users who have visited those pages or
                                            opened an email and for other related website statistics.
                                        </>,
                                    ]}
                                />
                                <p>
                                    Cookies can be &quot;Persistent&quot; or &quot;Session&quot;
                                    Cookies. Persistent Cookies remain on Your personal computer
                                    or mobile device when You go offline, while Session Cookies are
                                    deleted as soon as You close Your web browser.
                                </p>
                                <p>
                                    Where required by law, we use non-essential cookies (such as
                                    analytics, advertising, and remarketing cookies) only with Your
                                    consent. You can withdraw or change Your consent at any time
                                    using Our cookie preferences tool (if available) or through
                                    Your browser/device settings. Withdrawing consent does not
                                    affect the lawfulness of processing based on consent before its
                                    withdrawal.
                                </p>
                                <p>
                                    We use both Session and Persistent Cookies for the purposes set
                                    out below:
                                </p>
                                <BulletList
                                    items={[
                                        <>
                                            <strong>Necessary / Essential Cookies</strong>
                                            <br />
                                            Type: Session Cookies — Administered by: Us
                                            <br />
                                            Purpose: These Cookies are essential to provide You with
                                            services available through the Website and to enable You to
                                            use some of its features. They help to authenticate users
                                            and prevent fraudulent use of user accounts. Without these
                                            Cookies, the services that You have asked for cannot be
                                            provided, and We only use these Cookies to provide You with
                                            those services.
                                        </>,
                                        <>
                                            <strong>
                                                Cookies Policy / Notice Acceptance Cookies
                                            </strong>
                                            <br />
                                            Type: Persistent Cookies — Administered by: Us
                                            <br />
                                            Purpose: These Cookies identify if users have accepted the
                                            use of cookies on the Website.
                                        </>,
                                        <>
                                            <strong>Functionality Cookies</strong>
                                            <br />
                                            Type: Persistent Cookies — Administered by: Us
                                            <br />
                                            Purpose: These Cookies allow Us to remember choices You
                                            make when You use the Website, such as remembering your
                                            login details or language preference. The purpose of these
                                            Cookies is to provide You with a more personal experience
                                            and to avoid You having to re-enter your preferences every
                                            time You use the Website.
                                        </>,
                                    ]}
                                />
                                <p>
                                    For more information about the cookies we use and your choices
                                    regarding cookies, please visit our Cookies Policy or the
                                    Cookies section of Our Privacy Policy.
                                </p>
                            </SubSection>

                            <SubSection title="Use of Your Personal Data">
                                <p>
                                    The Company may use Personal Data for the following purposes:
                                </p>
                                <BulletList
                                    items={[
                                        <>
                                            <strong>To provide and maintain our Service</strong>,
                                            including to monitor the usage of our Service.
                                        </>,
                                        <>
                                            <strong>To manage Your Account:</strong> to manage Your
                                            registration as a user of the Service. The Personal Data
                                            You provide can give You access to different
                                            functionalities of the Service that are available to You as
                                            a registered user.
                                        </>,
                                        <>
                                            <strong>For the performance of a contract:</strong> the
                                            development, compliance and undertaking of the purchase
                                            contract for the products, items or services You have
                                            purchased or of any other contract with Us through the
                                            Service.
                                        </>,
                                        <>
                                            <strong>To contact You:</strong> To contact You by email,
                                            telephone calls, SMS, or other equivalent forms of
                                            electronic communication, such as a mobile
                                            application&apos;s push notifications regarding updates or
                                            informative communications related to the functionalities,
                                            products or contracted services, including the security
                                            updates, when necessary or reasonable for their
                                            implementation.
                                        </>,
                                        <>
                                            <strong>To provide You</strong> with news, special offers,
                                            and general information about other goods, services and
                                            events which We offer that are similar to those that you
                                            have already purchased or inquired about unless You have
                                            opted not to receive such information.
                                        </>,
                                        <>
                                            <strong>To manage Your requests:</strong> To attend and
                                            manage Your requests to Us.
                                        </>,
                                        <>
                                            <strong>For business transfers:</strong> We may use Your
                                            Personal Data to evaluate or conduct a merger, divestiture,
                                            restructuring, reorganization, dissolution, or other sale
                                            or transfer of some or all of Our assets.
                                        </>,
                                        <>
                                            <strong>For other purposes:</strong> We may use Your
                                            information for other purposes, such as data analysis,
                                            identifying usage trends, determining the effectiveness of
                                            our promotional campaigns and to evaluate and improve our
                                            Service, products, services, marketing and your experience.
                                        </>,
                                    ]}
                                />
                                <p className="mt-4">
                                    We may share Your Personal Data in the following situations:
                                </p>
                                <BulletList
                                    items={[
                                        <>
                                            <strong>With Service Providers:</strong> We may share Your
                                            Personal Data with Service Providers to monitor and analyze
                                            the use of our Service, to contact You.
                                        </>,
                                        <>
                                            <strong>For business transfers:</strong> We may share or
                                            transfer Your Personal Data in connection with, or during
                                            negotiations of, any merger, sale of Company assets,
                                            financing, or acquisition of all or a portion of Our
                                            business to another company.
                                        </>,
                                        <>
                                            <strong>With Affiliates:</strong> We may share Your
                                            Personal Data with Our affiliates, in which case we will
                                            require those affiliates to honor this Privacy Policy.
                                        </>,
                                        <>
                                            <strong>With business partners:</strong> We may share Your
                                            Personal Data with Our business partners to offer You
                                            certain products, services or promotions.
                                        </>,
                                        <>
                                            <strong>With other users:</strong> If Our Service offers
                                            public areas, when You share Personal Data or otherwise
                                            interact in the public areas with other users, such
                                            information may be viewed by all users and may be publicly
                                            distributed outside.
                                        </>,
                                        <>
                                            <strong>With Your consent:</strong> We may disclose Your
                                            Personal Data for any other purpose with Your consent.
                                        </>,
                                    ]}
                                />
                            </SubSection>

                            <SubSection title="Retention of Your Personal Data">
                                <p>
                                    The Company will retain Your Personal Data only for as long as
                                    is necessary for the purposes set out in this Privacy Policy.
                                    We will retain and use Your Personal Data to the extent
                                    necessary to comply with our legal obligations, resolve
                                    disputes, and enforce our legal agreements and policies.
                                </p>
                                <p>
                                    Where possible, We apply shorter retention periods and/or
                                    reduce identifiability by deleting, aggregating, or anonymizing
                                    data. We apply different retention periods to different
                                    categories of Personal Data based on the purpose of processing
                                    and legal obligations:
                                </p>
                                <BulletList
                                    items={[
                                        <>
                                            <strong>Account Information</strong> — User Accounts:
                                            retained for the duration of your account relationship plus
                                            up to 24 months after account closure to handle any
                                            post-termination issues or resolve disputes.
                                        </>,
                                        <>
                                            <strong>Usage Data</strong> — Website analytics data
                                            (cookies, IP addresses, device identifiers): up to 24
                                            months from the date of collection. Server logs (IP
                                            addresses, access times): up to 24 months for security
                                            monitoring and troubleshooting purposes.
                                        </>,
                                    ]}
                                />
                                <p>
                                    When retention periods expire, We securely delete or anonymize
                                    Personal Data. Residual copies may remain in encrypted backups
                                    for a limited period consistent with our backup retention
                                    schedule.
                                </p>
                            </SubSection>

                            <SubSection title="Transfer of Your Personal Data">
                                <p>
                                    Your information, including Personal Data, is processed at the
                                    Company&apos;s operating offices and in any other places where
                                    the parties involved in the processing are located. It means
                                    that this information may be transferred to — and maintained on
                                    — computers located outside of Your state, province, country or
                                    other governmental jurisdiction where the data protection laws
                                    may differ from those from Your jurisdiction.
                                </p>
                                <p>
                                    Where required by applicable law, We will ensure that
                                    international transfers of Your Personal Data are subject to
                                    appropriate safeguards. The Company will take all steps
                                    reasonably necessary to ensure that Your data is treated
                                    securely and in accordance with this Privacy Policy.
                                </p>
                            </SubSection>

                            <SubSection title="Delete Your Personal Data">
                                <p>
                                    You have the right to delete or request that We assist in
                                    deleting the Personal Data that We have collected about You.
                                </p>
                                <p>
                                    Our Service may give You the ability to delete certain
                                    information about You from within the Service. You may update,
                                    amend, or delete Your information at any time by signing in to
                                    Your Account, if you have one, and visiting the account
                                    settings section. You may also contact Us to request access to,
                                    correct, or delete any Personal Data that You have provided to
                                    Us.
                                </p>
                                <p>
                                    Please note, however, that We may need to retain certain
                                    information when we have a legal obligation or lawful basis to
                                    do so.
                                </p>
                            </SubSection>

                            <SubSection title="Disclosure of Your Personal Data">
                                <h4 className="font-serif text-lg text-stone-800 mt-6 mb-2">
                                    Business Transactions
                                </h4>
                                <p>
                                    If the Company is involved in a merger, acquisition or asset
                                    sale, Your Personal Data may be transferred. We will provide
                                    notice before Your Personal Data is transferred and becomes
                                    subject to a different Privacy Policy.
                                </p>
                                <h4 className="font-serif text-lg text-stone-800 mt-6 mb-2">
                                    Law Enforcement
                                </h4>
                                <p>
                                    Under certain circumstances, the Company may be required to
                                    disclose Your Personal Data if required to do so by law or in
                                    response to valid requests by public authorities (e.g. a court
                                    or a government agency).
                                </p>
                                <h4 className="font-serif text-lg text-stone-800 mt-6 mb-2">
                                    Other Legal Requirements
                                </h4>
                                <p>
                                    The Company may disclose Your Personal Data in the good faith
                                    belief that such action is necessary to:
                                </p>
                                <BulletList
                                    items={[
                                        "Comply with a legal obligation",
                                        "Protect and defend the rights or property of the Company",
                                        "Prevent or investigate possible wrongdoing in connection with the Service",
                                        "Protect the personal safety of Users of the Service or the public",
                                        "Protect against legal liability",
                                    ]}
                                />
                            </SubSection>

                            <SubSection title="Security of Your Personal Data">
                                <p>
                                    The security of Your Personal Data is important to Us, but
                                    remember that no method of transmission over the Internet, or
                                    method of electronic storage is 100% secure. While We strive
                                    to use commercially reasonable means to protect Your Personal
                                    Data, We cannot guarantee its absolute security.
                                </p>
                            </SubSection>
                        </Section>

                        {/* ==========================================
                Children's Privacy
                ========================================== */}
                        <Section title="Children's Privacy">
                            <p>
                                Our Service does not address anyone under the age of 16. We do
                                not knowingly collect personally identifiable information from
                                anyone under the age of 16. If You are a parent or guardian and
                                You are aware that Your child has provided Us with Personal Data,
                                please contact Us. If We become aware that We have collected
                                Personal Data from anyone under the age of 16 without
                                verification of parental consent, We take steps to remove that
                                information from Our servers.
                            </p>
                            <p>
                                If We need to rely on consent as a legal basis for processing
                                Your information and Your country requires consent from a parent,
                                We may require Your parent&apos;s consent before We collect and
                                use that information.
                            </p>
                        </Section>

                        {/* ==========================================
                Links to Other Websites
                ========================================== */}
                        <Section title="Links to Other Websites">
                            <p>
                                Our Service may contain links to other websites that are not
                                operated by Us. If You click on a third party link, You will be
                                directed to that third party&apos;s site. We strongly advise You
                                to review the Privacy Policy of every site You visit.
                            </p>
                            <p>
                                We have no control over and assume no responsibility for the
                                content, privacy policies or practices of any third party sites
                                or services.
                            </p>
                        </Section>

                        {/* ==========================================
                Changes to this Privacy Policy
                ========================================== */}
                        <Section title="Changes to this Privacy Policy">
                            <p>
                                We may update Our Privacy Policy from time to time. We will
                                notify You of any changes by posting the new Privacy Policy on
                                this page.
                            </p>
                            <p>
                                We will let You know via email and/or a prominent notice on Our
                                Service, prior to the change becoming effective and update the
                                &quot;Last updated&quot; date at the top of this Privacy Policy.
                            </p>
                            <p>
                                You are advised to review this Privacy Policy periodically for
                                any changes. Changes to this Privacy Policy are effective when
                                they are posted on this page.
                            </p>
                        </Section>

                        {/* ==========================================
                Contact Us
                ========================================== */}
                        <Section title="Contact Us">
                            <p>
                                If you have any questions about this Privacy Policy, You can
                                contact us:
                            </p>
                            <BulletList
                                items={[
                                    <>
                                        By email:{" "}
                                        <a
                                            href="mailto:ewen.bourgeat.tech@gmail.com"
                                            className="text-stone-800 underline underline-offset-2 hover:text-forest transition-colors"
                                        >
                                            ewen.bourgeat.tech@gmail.com
                                        </a>
                                    </>,
                                ]}
                            />
                        </Section>
                    </div>
                </div>
            </article>

            {/* Footer */}
            <footer className="border-t border-stone-200/60 py-10 px-4">
                <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="font-serif text-xs tracking-[0.2em] text-stone-400">
                        CALM HOME SPACES
                    </span>
                    <p className="text-[10px] text-stone-400 text-center md:text-right max-w-sm leading-relaxed">
                        En tant que Partenaire Amazon, nous réalisons un bénéfice sur les
                        achats remplissant les conditions requises.
                    </p>
                </div>
            </footer>
        </div>
    );
}

/* ==========================================
   Reusable sub-components for clean markup
   ========================================== */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-12 first:mt-0">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-800 mb-4">
                {title}
            </h2>
            <div className="w-8 h-px bg-stone-200 mb-6" />
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function SubSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-8">
            <h3 className="font-serif text-xl text-stone-700 mb-3">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function DefinitionList({
    items,
}: {
    items: { term: string; definition: React.ReactNode }[];
}) {
    return (
        <ul className="space-y-3 mt-3">
            {items.map((item) => (
                <li key={item.term} className="flex gap-2">
                    <span className="text-stone-300 mt-1.5 shrink-0">•</span>
                    <span>
                        <strong className="text-stone-800">{item.term}</strong>{" "}
                        {item.definition}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
    return (
        <ul className="space-y-3 mt-3">
            {items.map((item, i) => (
                <li key={i} className="flex gap-2">
                    <span className="text-stone-300 mt-1.5 shrink-0">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}
