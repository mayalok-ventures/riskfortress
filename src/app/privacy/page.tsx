import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy & Data Sovereignty Protocols | RiskFortress',
  description: 'RiskFortress Intelligence Privacy & Data Sovereignty Protocols — governing the collection, processing, and protection of confidential client data under Indian law.',
  robots: { index: false, follow: false },
}

const s = {
  page: { backgroundColor: '#0a0a0a', color: '#e8e8e8', fontFamily: '"Georgia", "Times New Roman", serif', minHeight: '100vh', margin: 0, padding: 0 } as React.CSSProperties,
  container: { maxWidth: '900px', margin: '0 auto', padding: '60px 32px 80px' } as React.CSSProperties,
  badge: { display: 'inline-block', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: '11px', letterSpacing: '3px', padding: '6px 16px', marginBottom: '32px', fontFamily: 'monospace', textTransform: 'uppercase' as const },
  h1: { fontSize: '2rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '8px' } as React.CSSProperties,
  docRef: { fontSize: '12px', color: '#666', fontFamily: 'monospace', marginBottom: '4px' } as React.CSSProperties,
  effective: { fontSize: '13px', color: '#888', marginBottom: '40px', fontStyle: 'italic' } as React.CSSProperties,
  preamble: { borderLeft: '3px solid #C9A84C', paddingLeft: '20px', color: '#bbb', fontSize: '15px', lineHeight: 1.8, marginBottom: '48px', fontStyle: 'italic' } as React.CSSProperties,
  divider: { border: 'none', borderTop: '1px solid #1e1e1e', margin: '48px 0' } as React.CSSProperties,
  h2: { fontSize: '1.1rem', fontWeight: 700, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '20px', fontFamily: 'monospace' } as React.CSSProperties,
  h3: { fontSize: '15px', fontWeight: 700, color: '#ffffff', marginTop: '24px', marginBottom: '10px' } as React.CSSProperties,
  p: { fontSize: '14.5px', lineHeight: 1.85, color: '#ccc', marginBottom: '16px' } as React.CSSProperties,
  li: { fontSize: '14.5px', lineHeight: 1.85, color: '#ccc', marginBottom: '8px' } as React.CSSProperties,
  ul: { paddingLeft: '24px', marginBottom: '16px' } as React.CSSProperties,
  ol: { paddingLeft: '24px', marginBottom: '16px' } as React.CSSProperties,
  highlight: { color: '#C9A84C', fontWeight: 600 } as React.CSSProperties,
  infoBlock: { background: '#0f0f0f', border: '1px solid #222', borderLeft: '3px solid #C9A84C', padding: '20px 24px', marginBottom: '20px', borderRadius: '4px' } as React.CSSProperties,
  footer: { borderTop: '1px solid #1a1a1a', marginTop: '80px', paddingTop: '40px', textAlign: 'center' as const, color: '#555', fontSize: '13px', lineHeight: 2 } as React.CSSProperties,
  footerLink: { color: '#C9A84C', textDecoration: 'none', margin: '0 12px' } as React.CSSProperties,
}

export default function PrivacyPage() {
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.badge}>Classified Protocol Document</div>
        <h1 style={s.h1}>Privacy &amp; Data Sovereignty Protocols</h1>
        <p style={s.docRef}>Document Reference: RF/LEGAL/PRIVACY/2026-001</p>
        <p style={s.effective}>Effective Date: April 20, 2026 &nbsp;|&nbsp; Jurisdiction: Greater Noida, Uttar Pradesh, India</p>

        <div style={s.preamble}>
          This document constitutes the binding Privacy &amp; Data Sovereignty Protocol of RiskFortress Intelligence, a Mayalok Ventures entity, DPIIT Registered, operating from Pari Chowk, Greater Noida, Uttar Pradesh 201310, India (hereinafter &ldquo;<strong style={s.highlight}>RiskFortress</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, or &ldquo;<strong>us</strong>&rdquo;). This Protocol governs the collection, processing, storage, transfer, and deletion of all non-public and confidential information entrusted to RiskFortress by its Clients. By engaging our services or accessing riskfortress.in, you acknowledge, accept, and are legally bound by the terms herein.
        </div>

        {/* ARTICLE I */}
        <h2 style={s.h2}>Article I — Interpretation &amp; Definitions</h2>
        <p style={s.p}>For the purposes of this Protocol, the following terms shall have the meanings ascribed to them herein. All defined terms shall apply equally to their singular and plural forms.</p>
        <ul style={s.ul}>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Client&rdquo;</strong> means any individual, corporate entity, family office, trust, or institution that has engaged RiskFortress under a signed Statement of Work, intake form submission, or written engagement mandate, possessing minimum assets of ₹100 Crore (Indian Rupees One Hundred Crore) under active management or ownership.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Intelligence Data&rdquo;</strong> means all raw, processed, or derived data — including but not limited to OSINT findings, forensic artifacts, financial profiling outputs, geospatial analysis, corporate registry extracts, and threat assessments — compiled or generated by RiskFortress in the course of a Client engagement.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Forensic Artifacts&rdquo;</strong> means digital or physical evidentiary materials, including document metadata, network traffic logs, registry entries, timestamps, hash values, chain-of-custody records, and any derivative analysis thereof.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Sovereign Data&rdquo;</strong> means any Intelligence Data or Client-submitted information that is subject to the data sovereignty principles of the Republic of India, processed and stored within India-based infrastructure under Indian law.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Sensitive Personal Data or Information (SPDI)&rdquo;</strong> has the meaning ascribed under Rule 3 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, including financial information, biometric data, health data, passwords, sexual orientation, and related categories.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Processing&rdquo;</strong> means any operation performed on personal data, including collection, recording, organization, structuring, storage, adaptation, retrieval, consultation, use, disclosure, dissemination, restriction, erasure, or destruction.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Data Principal&rdquo;</strong> means the natural person to whom personal data relates, as defined under the Digital Personal Data Protection Act, 2023.</li>
          <li style={s.li}><strong style={s.highlight}>&ldquo;Data Fiduciary&rdquo;</strong> means RiskFortress Intelligence (a Mayalok Ventures entity), which determines the purpose and means of Processing of personal data, as defined under the Digital Personal Data Protection Act, 2023.</li>
        </ul>

        <hr style={s.divider} />

        {/* ARTICLE II */}
        <h2 style={s.h2}>Article II — Collection of Non-Public Information</h2>
        <p style={s.p}>RiskFortress collects, processes, and analyzes the following categories of non-public information exclusively for the performance of mandated intelligence services:</p>
        <h3 style={s.h3}>2.1 — Categories of Data Collected</h3>
        <ul style={s.ul}>
          <li style={s.li}><strong>Biometric Data:</strong> Facial recognition patterns, fingerprint data, voiceprint analysis, and behavioral biometrics — only where explicitly authorized under a signed engagement protocol and applicable law.</li>
          <li style={s.li}><strong>Financial Data:</strong> Asset valuations, banking relationships, shareholding structures, beneficial ownership chains, investment portfolios, tax filings, credit profiles, and cross-border financial flows.</li>
          <li style={s.li}><strong>Geospatial Data:</strong> Property ownership records, travel patterns, location history derived from publicly available and lawfully obtained sources, and real-time geospatial threat mapping.</li>
          <li style={s.li}><strong>OSINT Vectors:</strong> Publicly available social media footprints, court and litigation records, corporate registry filings (MCA, NCLT, BSE/NSE disclosures), property registration data, academic credentials, and professional association memberships — accessed through lawful open-source intelligence methods.</li>
        </ul>
        <h3 style={s.h3}>2.2 — Method of Collection</h3>
        <p style={s.p}>Information is collected through: (a) Client-submitted intake forms and engagement documents; (b) Lawful OSINT methodologies; (c) Authorized third-party data providers operating under applicable Indian law; (d) Public registries, court records, and statutory filings; and (e) Technical intelligence and network analysis tools where contractually authorized.</p>
        <h3 style={s.h3}>2.3 — Voluntarily Submitted Information</h3>
        <p style={s.p}>Any information submitted voluntarily by the Client through our secure intake portal, encrypted communications, or direct engagement is treated as Confidential Information and processed exclusively for the stated engagement purpose.</p>
        <h3 style={s.h3}>2.4 — Minors &amp; Children&rsquo;s Data</h3>
        <div style={s.infoBlock}>
          <p style={{...s.p, marginBottom: 0}}>RiskFortress does not knowingly collect, process, or retain personal data of individuals below the age of 18 years. Our services are designed exclusively for adult corporate entities, institutional mandates, and senior executives. If minor data is inadvertently collected in the course of an engagement, it will be permanently deleted without retention or further processing upon identification. Clients expressly warrant that no information submitted to RiskFortress pertains to individuals below 18 years of age, absent specific legal mandate requiring otherwise.</p>
        </div>

        <hr style={s.divider} />

        {/* ARTICLE III */}
        <h2 style={s.h2}>Article III — Website Analytics &amp; Cookie Policy</h2>
        <p style={s.p}>riskfortress.in employs <strong>Cloudflare Web Analytics</strong> exclusively for website security, performance monitoring, and traffic analysis. The following conditions govern this usage:</p>
        <ul style={s.ul}>
          <li style={s.li}>No Personally Identifiable Information (PII) is collected through the website analytics layer.</li>
          <li style={s.li}>Cloudflare Web Analytics operates on a privacy-first architecture — it does not use cookies, browser fingerprinting, or cross-site tracking mechanisms. Aggregate data only is processed.</li>
          <li style={s.li}>Clients and visitors may disable cookies through their browser settings at any time without any loss of access to riskfortress.in or degradation of service.</li>
          <li style={s.li}><strong>RiskFortress does not use, deploy, or permit:</strong> advertising networks, retargeting pixels, behavioral tracking scripts, third-party analytics SDKs, social media trackers, or any form of surveillance-grade web analytics.</li>
          <li style={s.li}>Google Analytics (GA4) is used solely in aggregate, anonymized form for traffic source analysis. IP anonymization is enforced. No cross-device tracking or advertising profiles are built.</li>
        </ul>

        <hr style={s.divider} />

        {/* ARTICLE IV */}
        <h2 style={s.h2}>Article IV — Purpose of Processing (Need-to-Know Basis)</h2>
        <p style={s.p}>All processing of Client data is governed by the principle of strict purpose limitation. Data collected for one engagement shall not be repurposed, cross-used, or amalgamated for any other engagement without express written consent. The authorized purposes of processing are:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Risk Mitigation:</strong> Identification, profiling, and neutralization of threats to Client assets, reputation, operations, and personnel.</li>
          <li style={s.li}><strong>Threat Forecasting:</strong> Predictive modeling, macro-financial forensics, geopolitical risk modeling, and scenario planning for strategic decision-making.</li>
          <li style={s.li}><strong>Legal Admissibility:</strong> Preparation of forensic reports, chain-of-custody documentation, and evidentiary packages to the standard required for Indian court proceedings or regulatory submissions.</li>
          <li style={s.li}><strong>Statutory &amp; Structural Intelligence:</strong> Analysis of regulatory exposure, corporate governance deficiencies, and statutory compliance risk.</li>
        </ul>
        <div style={s.infoBlock}>
          <p style={{...s.p, marginBottom: 0}}><strong style={s.highlight}>Absolute Prohibition:</strong> RiskFortress does not sell, trade, barter, license, rent, commercially exploit, or otherwise transfer Client data to any third party for commercial gain under any circumstances. This prohibition is unconditional and survives termination of any engagement.</p>
        </div>

        <hr style={s.divider} />

        {/* ARTICLE V */}
        <h2 style={s.h2}>Article V — Data Processing, Localization &amp; AI Usage</h2>
        <h3 style={s.h3}>5(a) — Compliance Standards</h3>
        <p style={s.p}>All data processing operations comply with the Digital Personal Data Protection (DPDP) Act 2023, the Information Technology Act 2000 (as amended), IT (SPDI) Rules 2011, and maintain SOC2-grade operational expectations for data handling, access control, and audit trails.</p>
        <h3 style={s.h3}>5(b) — Absolute AI Training Prohibition</h3>
        <div style={s.infoBlock}>
          <p style={{...s.p, marginBottom: 0}}><strong style={s.highlight}>UNCONDITIONAL PROHIBITION:</strong> No Client forensic data, network intelligence logs, intelligence reports, engagement communications, analytical outputs, or any confidential data of any nature whatsoever will EVER be used — directly or indirectly — to train, fine-tune, benchmark, evaluate, or otherwise improve any internal or third-party artificial intelligence, machine learning, large language model, or automated decision-making system. This prohibition is absolute, unconditional, irrevocable, and survives indefinitely beyond the termination of any engagement.</p>
        </div>
        <h3 style={s.h3}>5(c) — Role-Based Access Control (RBAC)</h3>
        <p style={s.p}>Client data is accessible exclusively to personnel with a direct, documented operational need on the specific engagement for which the data was collected. RiskFortress maintains:</p>
        <ul style={s.ul}>
          <li style={s.li}>Granular Role-Based Access Control (RBAC) protocols enforced at system level.</li>
          <li style={s.li}>Immutable access logs maintained for all data access events, retained for 7 years.</li>
          <li style={s.li}>Quarterly internal access audits and mandatory access revocation upon engagement closure.</li>
          <li style={s.li}>Zero-trust architecture applied to all internal data access pathways.</li>
        </ul>
        <h3 style={s.h3}>5(d) — Data Localization</h3>
        <p style={s.p}>All Client data is processed and stored on India-based infrastructure wherever technically feasible, in compliance with DPDP Act 2023 data localization principles. Any cross-border transfer occurs only to jurisdictions notified under the DPDP Act Schedule and is governed by contractual safeguards including Standard Contractual Clauses equivalent or binding processing agreements.</p>

        <hr style={s.divider} />

        {/* ARTICLE VI */}
        <h2 style={s.h2}>Article VI — Data Retention &amp; Digital Shredding</h2>
        <h3 style={s.h3}>6.1 — Retention Period</h3>
        <p style={s.p}>Client data is retained for the shorter of: (a) seven (7) years from the date of collection, consistent with the Limitation Act, 1963; or (b) the date of contractual termination plus thirty (30) days for orderly closure. Thereafter, data is subject to certified digital destruction.</p>
        <h3 style={s.h3}>6.2 — Air-Gapped Storage &amp; Secure Deletion</h3>
        <p style={s.p}>Sensitive intelligence artifacts are stored in air-gapped, encrypted repositories using AES-256 encryption at rest. Digital shredding employs DoD 5220.22-M or equivalent multi-pass overwrite standards, ensuring data is irrecoverable post-deletion.</p>
        <h3 style={s.h3}>6.3 — Certificate of Destruction</h3>
        <p style={s.p}>Upon completion of the retention period or Client request for erasure, RiskFortress issues a formal Certificate of Destruction confirming secure deletion of all Client data from active systems, archives, and backups within the technically feasible scope.</p>
        <h3 style={s.h3}>6.4 — Data Breach Notification</h3>
        <div style={s.infoBlock}>
          <p style={{...s.p, marginBottom: 0}}>In the event of a confirmed or reasonably suspected data breach, RiskFortress will: (a) notify the <strong>Data Protection Board of India</strong> in accordance with DPDP Act 2023 mandates; and (b) notify all affected Data Principals — within <strong style={s.highlight}>72 hours</strong> of becoming aware of the breach. Notification shall include: the nature and scope of the breach, categories of data affected, likely consequences, and remedial measures taken or proposed. A formal Breach Register is maintained and available for regulatory inspection.</p>
        </div>

        <hr style={s.divider} />

        {/* ARTICLE VII */}
        <h2 style={s.h2}>Article VII — Disclosure to Third Parties &amp; Law Enforcement</h2>
        <p style={s.p}>RiskFortress maintains an absolute policy of non-disclosure of Client information to any third party, governmental authority, law enforcement body, or regulatory agency absent a lawful mandate. Specifically:</p>
        <ul style={s.ul}>
          <li style={s.li}>Disclosure occurs only pursuant to a valid court order, judicial process, or statutory mandate issued by a competent authority under Indian law.</li>
          <li style={s.li}>RiskFortress does not voluntarily disclose Client information to police, investigative agencies, or regulatory bodies without lawful compulsion.</li>
          <li style={s.li}>Where legally permissible, the affected Client will be notified prior to any disclosure to allow exercise of legal remedies including injunctions or appeals.</li>
          <li style={s.li}>Comprehensive logs of all disclosure demands, responses, and disclosures are maintained and available for Client review upon lawful request.</li>
          <li style={s.li}>RiskFortress reserves the right to challenge any disclosure demand that appears overbroad, disproportionate, or lacking lawful basis before a competent court.</li>
        </ul>

        <hr style={s.divider} />

        {/* ARTICLE VIII */}
        <h2 style={s.h2}>Article VIII — Lawful Basis &amp; Consent</h2>
        <p style={s.p}>RiskFortress processes personal data on the following lawful bases under the Digital Personal Data Protection Act, 2023:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>(a) Consent:</strong> Freely given, specific, informed, and unambiguous consent obtained from the Data Principal prior to engagement commencement, via our secure intake form checkbox mechanism and/or written engagement confirmation.</li>
          <li style={s.li}><strong>(b) Legitimate Interests:</strong> Processing necessary for the legitimate interests of RiskFortress as Data Fiduciary, provided such interests do not override the fundamental rights of the Data Principal.</li>
          <li style={s.li}><strong>(c) Legal Obligations:</strong> Processing required for compliance with applicable Indian law, court orders, or regulatory obligations.</li>
        </ul>
        <p style={s.p}>Consent may be withdrawn at any time by written notice to <strong style={s.highlight}>[email protected]</strong>. Withdrawal is effective from the date of receipt and does not affect the lawfulness of prior processing. Withdrawal requests are processed within <strong>30 days</strong> of receipt.</p>

        <hr style={s.divider} />

        {/* ARTICLE IX */}
        <h2 style={s.h2}>Article IX — Data Principal Rights</h2>
        <p style={s.p}>Under the Digital Personal Data Protection Act, 2023, each Data Principal possesses the following rights, exercisable by written request to our Grievance Redressal Officer:</p>
        <ol style={s.ol}>
          <li style={s.li}><strong>Right to Confirmation &amp; Access:</strong> Confirmation of whether personal data is being processed and access to a summary of data held and processing activities.</li>
          <li style={s.li}><strong>Right to Correction &amp; Erasure:</strong> Correction of inaccurate or outdated personal data and erasure where retention is no longer justified by lawful purpose.</li>
          <li style={s.li}><strong>Right to Grievance Redressal:</strong> Access to a functional grievance mechanism with defined response timelines.</li>
          <li style={s.li}><strong>Right to Nomination:</strong> Nomination of another individual to exercise rights in the event of the Data Principal&rsquo;s death or incapacity.</li>
          <li style={s.li}><strong>Right to Withdraw Consent:</strong> Withdrawal of consent at any time without prejudice to prior lawful processing, effective within 30 days of written request.</li>
          <li style={s.li}><strong>Right to Approach the Board:</strong> Filing a complaint with the Data Protection Board of India where the Data Principal is dissatisfied with RiskFortress&rsquo;s response.</li>
        </ol>

        <hr style={s.divider} />

        {/* ARTICLE X */}
        <h2 style={s.h2}>Article X — Grievance Redressal Officer</h2>
        <div style={s.infoBlock}>
          <p style={s.p}><strong style={s.highlight}>Name:</strong> Kunal Pratap Singh</p>
          <p style={s.p}><strong style={s.highlight}>Designation:</strong> Founder &amp; Data Protection Officer</p>
          <p style={s.p}><strong style={s.highlight}>Organization:</strong> RiskFortress Intelligence (A Mayalok Ventures Entity)</p>
          <p style={s.p}><strong style={s.highlight}>Email:</strong> <a href="mailto:[email protected]" style={{color:'#C9A84C'}}>[email protected]</a></p>
          <p style={s.p}><strong style={s.highlight}>Address:</strong> Pari Chowk, Greater Noida, Uttar Pradesh 201310, India</p>
          <p style={{...s.p, marginBottom: 0}}><strong style={s.highlight}>Response SLA:</strong> Acknowledged within 48 hours of receipt. Resolution within 30 days.</p>
        </div>

        <hr style={s.divider} />

        {/* ARTICLE XI */}
        <h2 style={s.h2}>Article XI — Amendments &amp; Governing Law</h2>
        <p style={s.p}>RiskFortress reserves the right to amend, update, or revise this Privacy &amp; Data Sovereignty Protocol at any time. Material amendments shall be communicated to active Clients no less than <strong>30 days prior to the effective date</strong> via registered email or the secure client portal. Continued engagement following the effective date of any amendment constitutes acceptance thereof.</p>
        <p style={s.p}>This Protocol is governed by, and construed in accordance with, the laws of the <strong>Republic of India</strong>. All disputes arising out of or in connection with this Protocol shall be subject to the exclusive jurisdiction of courts at <strong>Greater Noida, Uttar Pradesh</strong>, without prejudice to RiskFortress&rsquo;s right to seek emergency injunctive relief before any court of competent jurisdiction.</p>

        <hr style={s.divider} />

        <footer style={s.footer}>
          <p><strong style={{color:'#C9A84C'}}>RiskFortress Intelligence</strong></p>
          <p>A Mayalok Ventures Entity &nbsp;|&nbsp; DPIIT Registered</p>
          <p>Intelligence Node: Greater Noida, NCR, India</p>
          <p style={{marginTop:'12px'}}>
            <a href="/privacy" style={s.footerLink}>Privacy Protocols</a>
            <a href="/terms" style={s.footerLink}>Master Service Agreement</a>
          </p>
          <p style={{marginTop:'12px', fontSize:'12px', color:'#444'}}>&copy; 2026 Mayalok Ventures. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
