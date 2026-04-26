import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Master Service Agreement & Terms of Use | RiskFortress',
  description: 'RiskFortress Intelligence Master Service Agreement & Terms of Use — binding terms governing all engagements under Indian law.',
  robots: { index: false, follow: false },
}

const S = {
  page: { backgroundColor: '#0a0a0a', color: '#e8e8e8', fontFamily: '"Georgia","Times New Roman",serif', minHeight: '100vh', margin: 0, padding: 0 } as React.CSSProperties,
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '60px 32px 80px' } as React.CSSProperties,
  badge: { display: 'inline-block', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: '11px', letterSpacing: '3px', padding: '6px 16px', marginBottom: '32px', fontFamily: 'monospace', textTransform: 'uppercase' as const },
  h1: { fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '8px' } as React.CSSProperties,
  ref: { fontSize: '12px', color: '#666', fontFamily: 'monospace', marginBottom: '4px' } as React.CSSProperties,
  eff: { fontSize: '13px', color: '#888', marginBottom: '40px', fontStyle: 'italic' } as React.CSSProperties,
  pre: { borderLeft: '3px solid #C9A84C', paddingLeft: '20px', color: '#bbb', fontSize: '15px', lineHeight: 1.8, marginBottom: '48px', fontStyle: 'italic' } as React.CSSProperties,
  hr: { border: 'none', borderTop: '1px solid #1e1e1e', margin: '48px 0' } as React.CSSProperties,
  h2: { fontSize: '1.05rem', fontWeight: 700, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '20px', fontFamily: 'monospace' } as React.CSSProperties,
  h3: { fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '24px', marginBottom: '10px' } as React.CSSProperties,
  p: { fontSize: '14.5px', lineHeight: 1.85, color: '#ccc', marginBottom: '16px' } as React.CSSProperties,
  li: { fontSize: '14.5px', lineHeight: 1.85, color: '#ccc', marginBottom: '8px' } as React.CSSProperties,
  ul: { paddingLeft: '24px', marginBottom: '16px' } as React.CSSProperties,
  ol: { paddingLeft: '24px', marginBottom: '16px' } as React.CSSProperties,
  gold: { color: '#C9A84C', fontWeight: 600 } as React.CSSProperties,
  box: { background: '#0f0f0f', border: '1px solid #222', borderLeft: '3px solid #C9A84C', padding: '20px 24px', marginBottom: '20px', borderRadius: '4px' } as React.CSSProperties,
  warn: { background: '#0f0a0a', border: '1px solid #2a1a1a', borderLeft: '3px solid #8b0000', padding: '20px 24px', marginBottom: '20px', borderRadius: '4px', color: '#ccc', fontSize: '14.5px', lineHeight: 1.85 } as React.CSSProperties,
  caps: { fontWeight: 700, color: '#fff', letterSpacing: '0.5px', fontSize: '14px' } as React.CSSProperties,
  foot: { borderTop: '1px solid #1a1a1a', marginTop: '80px', paddingTop: '40px', textAlign: 'center' as const, color: '#555', fontSize: '13px', lineHeight: 2 } as React.CSSProperties,
  flink: { color: '#C9A84C', textDecoration: 'none', margin: '0 12px' } as React.CSSProperties,
}

export default function TermsPage() {
  return (
    <div style={S.page}>
      <div style={S.wrap}>

        <div style={S.badge}>Binding Legal Instrument</div>
        <h1 style={S.h1}>Master Service Agreement &amp; Terms of Use</h1>
        <p style={S.ref}>Document Reference: RF/LEGAL/MSA/2026-001</p>
        <p style={S.eff}>Effective Date: April 20, 2026 &nbsp;|&nbsp; Jurisdiction: Greater Noida, Uttar Pradesh, India</p>

        <div style={S.pre}>
          This Master Service Agreement and Terms of Use (hereinafter <strong style={S.gold}>&ldquo;Agreement&rdquo;</strong> or <strong style={S.gold}>&ldquo;MSA&rdquo;</strong>) constitutes a legally binding contract between RiskFortress Intelligence, a Mayalok Ventures entity, DPIIT Registered, Pari Chowk, Greater Noida, Uttar Pradesh 201310, India (hereinafter <strong style={S.gold}>&ldquo;RiskFortress&rdquo;</strong>) and any Client engaging its services. By executing a Statement of Work, submitting an intake form, making payment, or engaging in any written confirmation of services, the Client acknowledges full acceptance of and legal obligation under this Agreement. This Agreement supersedes all prior representations, understandings, and negotiations, whether oral or written.
        </div>

        {/* I */}
        <h2 style={S.h2}>Article I — Nature of Services (Advisory Capacity)</h2>
        <h3 style={S.h3}>1.1 — Intelligence Advisory Services</h3>
        <p style={S.p}>RiskFortress provides predictive forensic intelligence, macro-financial forensics, statutory and structural intelligence, OSINT analysis, threat profiling, and discrete consultation services exclusively to qualifying Ultra-High Net Worth Individuals and institutions. All deliverables constitute intelligence advisory outputs — not legal opinions, investment advice, or guarantees of any outcome.</p>
        <h3 style={S.h3}>1.2 — Legal Advisory Exclusion</h3>
        <p style={S.p}>Nothing in any RiskFortress intelligence product, report, dossier, risk map, or communication constitutes legal advice. Clients requiring legal counsel are expressly directed to engage qualified advocates licensed under the Advocates Act, 1961.</p>
        <h3 style={S.h3}>1.3 — The Crystal Ball Disclaimer</h3>
        <div style={S.box}>
          <p style={{...S.p, marginBottom:0}}>All intelligence products, threat assessments, risk forecasts, and advisory outputs produced by RiskFortress are <strong style={S.gold}>probabilistic in nature</strong> and represent the best available analytical judgment of RiskFortress at the time of production. They do not constitute guarantees, predictions, or warranties of future events, outcomes, market movements, legal results, or risk materialisation. Intelligence is inherently incomplete. Adversaries adapt. Environments shift. RiskFortress provides the most rigorous analytical framework available — not omniscience.</p>
        </div>
        <h3 style={S.h3}>1.4 — Warranty Disclaimer</h3>
        <div style={S.warn}>
          <p style={S.caps}>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ALL SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. RISKFORTRESS EXPRESSLY DISCLAIMS ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, TITLE, OR NON-INFRINGEMENT. RISKFORTRESS DOES NOT WARRANT THAT SERVICES WILL MEET CLIENT REQUIREMENTS, THAT INTELLIGENCE PRODUCTS WILL BE ERROR-FREE OR UNINTERRUPTED, OR THAT ANY THREAT OR RISK IDENTIFIED REPRESENTS THE TOTALITY OF EXISTING THREATS.</p>
        </div>
        <h3 style={S.h3}>1.5 — Prohibited Uses</h3>
        <p style={S.p}>Client shall not, under any circumstances, use RiskFortress services or any deliverable therefrom:</p>
        <ul style={S.ul}>
          <li style={S.li}>(a) For any illegal, fraudulent, tortious, or harmful purpose under applicable Indian or international law;</li>
          <li style={S.li}>(b) To surveil, track, or monitor any individual in violation of applicable privacy or data protection law;</li>
          <li style={S.li}>(c) To facilitate, plan, execute, or conceal insider trading, market manipulation, financial fraud, money laundering, or any financial crime;</li>
          <li style={S.li}>(d) To infringe, misappropriate, or circumvent any third-party intellectual property, privacy, or contractual rights;</li>
          <li style={S.li}>(e) To compete with, replicate, reverse-engineer, or commercially exploit RiskFortress&rsquo;s proprietary methodologies, analytical frameworks, or intelligence infrastructure.</li>
        </ul>

        <hr style={S.hr} />

        {/* II */}
        <h2 style={S.h2}>Article II — Intellectual Property Rights</h2>
        <p style={S.p}>All work product produced by RiskFortress — including but not limited to Intelligence Dossiers, Risk Maps, Threat Assessments, Macro-Financial Forensic Reports, Engagement Templates, Algorithmic Frameworks, Analytical Methodologies, and Software Tools — constitutes the exclusive intellectual property of RiskFortress and is protected under the Indian Copyright Act, 1957, the Patents Act, 1970, and applicable trade secret law.</p>
        <p style={S.p}>Upon receipt of full payment per the applicable Statement of Work, Client is granted a <strong>limited, non-exclusive, non-transferable, non-sublicensable, revocable license</strong> for internal business use only. This license expressly excludes:</p>
        <ul style={S.ul}>
          <li style={S.li}>Reproduction, distribution, or publication of any work product in whole or in part;</li>
          <li style={S.li}>Reverse-engineering, decompiling, or extracting any methodology or algorithm;</li>
          <li style={S.li}>Sublicensing, reselling, or transferring work product to any third party;</li>
          <li style={S.li}>Use in any legal proceeding without prior written authorization from RiskFortress;</li>
          <li style={S.li}>Use beyond the scope of the engagement for which the work product was produced.</li>
        </ul>
        <p style={S.p}>RiskFortress retains all moral rights over its work product. Client&rsquo;s failure to fully pay engagement fees immediately voids the license granted herein, and all work product must be returned or destroyed within 5 business days.</p>

        <hr style={S.hr} />

        {/* III */}
        <h2 style={S.h2}>Article III — Limitation of Liability</h2>
        <div style={S.warn}>
          <p style={S.caps}>ARTICLE III CONTAINS CRITICAL LIMITATIONS ON RISKFORTRESS&rsquo;S LIABILITY. READ CAREFULLY.</p>
        </div>
        <h3 style={S.h3}>3(a) — Exclusion of Consequential &amp; Indirect Damages</h3>
        <div style={S.warn}>
          <p style={S.caps}>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RISKFORTRESS SHALL NOT BE LIABLE — UNDER ANY THEORY OF LIABILITY, INCLUDING CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE — FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER, INCLUDING BUT NOT LIMITED TO: LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF BUSINESS OPPORTUNITY, LOSS OF GOODWILL, LOSS OF DATA, REPUTATIONAL HARM, BUSINESS INTERRUPTION, OR COST OF SUBSTITUTE SERVICES — EVEN IF RISKFORTRESS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
        </div>
        <h3 style={S.h3}>3(b) — Maximum Aggregate Liability Cap</h3>
        <div style={S.box}>
          <p style={{...S.p, marginBottom:0}}>The maximum aggregate liability of RiskFortress to the Client — for all claims arising under or in connection with this Agreement, whether in contract, tort, or otherwise — shall not exceed the <strong style={S.gold}>total fees actually paid by the Client to RiskFortress in the twelve (12) month period immediately preceding the event giving rise to the claim</strong>. This cap applies in aggregate across all claims and is not per-incident.</p>
        </div>
        <h3 style={S.h3}>3(c) — Nature of Services Acknowledgement</h3>
        <p style={S.p}>The Client expressly acknowledges that RiskFortress&rsquo;s services constitute intelligence and risk advisory — not guarantees, insurance, or absolute protection against threats, losses, or adverse outcomes. The Client assumes full responsibility for all decisions made, actions taken, or actions not taken based on any RiskFortress deliverable.</p>
        <h3 style={S.h3}>3(d) — Client Infrastructure Responsibility</h3>
        <p style={S.p}>The Client is solely and exclusively responsible for their own cybersecurity posture, IT infrastructure security, access controls, employee security hygiene, and operational security protocols. RiskFortress&rsquo;s liability does not extend — under any circumstances — to losses, damages, or adverse outcomes arising from the Client&rsquo;s own infrastructure failures, negligence, failure to implement RiskFortress&rsquo;s recommended security measures, insider threats, or third-party breaches of Client systems.</p>
        <h3 style={S.h3}>3(e) — Scope of Limitation</h3>
        <p style={S.p}>The limitations and exclusions set forth in this Article III apply to the fullest extent permitted by applicable Indian law and survive termination of this Agreement.</p>

        <hr style={S.hr} />

        {/* IV */}
        <h2 style={S.h2}>Article IV — Indemnification</h2>
        <p style={S.p}>Client shall defend, indemnify, and hold harmless RiskFortress Intelligence and all of its affiliates, directors, officers, employees, contractors, agents, and successors (collectively, <strong style={S.gold}>&ldquo;Indemnified Parties&rdquo;</strong>) from and against any and all claims, demands, actions, proceedings, liabilities, losses, damages, penalties, fines, costs, and expenses (including reasonable legal fees) arising out of or related to:</p>
        <ul style={S.ul}>
          <li style={S.li}>(a) Client&rsquo;s misuse, modification, or unauthorized distribution of services or any work product;</li>
          <li style={S.li}>(b) Client&rsquo;s breach of any term, representation, or warranty under this Agreement;</li>
          <li style={S.li}>(c) Client&rsquo;s violation of any applicable law, regulation, or third-party right;</li>
          <li style={S.li}>(d) Actions taken or not taken by Client based on intelligence, reports, or recommendations delivered by RiskFortress;</li>
          <li style={S.li}>(e) Third-party claims arising from Client&rsquo;s business operations, decisions, or conduct;</li>
          <li style={S.li}>(f) Submission of false, incomplete, misleading, or unauthorized information to RiskFortress in the course of any engagement.</li>
        </ul>
        <p style={S.p}>RiskFortress reserves the right to participate in the defense of any indemnified claim at Client&rsquo;s sole expense with counsel of RiskFortress&rsquo;s choosing. No settlement of any indemnified claim may be entered into by Client without the prior written consent of RiskFortress.</p>

        <hr style={S.hr} />

        {/* V */}
        <h2 style={S.h2}>Article V — Fees, Payment Terms &amp; Refund Policy</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>(a) Fee Structure:</strong> All fees are specified in the applicable Statement of Work, quoted in Indian Rupees (INR) unless expressly stated otherwise in writing.</li>
          <li style={S.li}><strong>(b) Payment Schedule:</strong> Fifty percent (50%) of the total engagement fee is payable as a non-refundable advance upon execution of the Statement of Work or written engagement confirmation. The remaining fifty percent (50%) is payable upon delivery of the final intelligence product or completion of the engagement milestone.</li>
          <li style={S.li}><strong>(c) Late Payment:</strong> Amounts unpaid beyond fifteen (15) days of the due date shall attract interest at the rate of eighteen percent (18%) per annum, compounding monthly, from the due date to the date of actual payment.</li>
          <li style={S.li}><strong>(d) GST &amp; Taxes:</strong> All fees quoted are exclusive of Goods and Services Tax (GST) and all applicable taxes, levies, and duties, which shall be charged at prevailing statutory rates and borne solely by the Client.</li>
          <li style={S.li}><strong>(e) Refund Policy:</strong> The advance fee is non-refundable once intelligence collection, research, or analysis has commenced. Pre-commencement cancellations may receive a refund of the advance less administrative costs, capped at ten percent (10%) of the advance amount. No refunds are available on completed deliverables under any circumstance.</li>
        </ul>

        <hr style={S.hr} />

        {/* VI */}
        <h2 style={S.h2}>Article VI — Term and Termination</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>(a) Term:</strong> This Agreement commences on the Effective Date and continues until completion of all engagement obligations per the applicable Statement of Work, unless earlier terminated in accordance with this Article.</li>
          <li style={S.li}><strong>(b) Termination for Convenience:</strong> Either party may terminate this Agreement upon thirty (30) days&rsquo; prior written notice. In the event of Client-initiated termination, Client shall pay for all services delivered and costs incurred up to the effective date of termination.</li>
          <li style={S.li}><strong>(c) Termination for Cause:</strong> RiskFortress may terminate this Agreement immediately upon written notice in the event of: (i) Client&rsquo;s material breach uncured within fifteen (15) days of written notice; (ii) Client&rsquo;s insolvency, bankruptcy, or appointment of a liquidator; or (iii) Client&rsquo;s fraudulent or illegal conduct causing or likely to cause material harm to RiskFortress or third parties.</li>
          <li style={S.li}><strong>(d) Effects of Termination:</strong> Upon termination, Client shall immediately cease use of all work product and pay all outstanding fees. The following provisions survive termination indefinitely: Intellectual Property Rights (Article II), Limitation of Liability (Article III), Indemnification (Article IV), Confidentiality (Article VII), and Dispute Resolution (Article IX).</li>
        </ul>

        <hr style={S.hr} />

        {/* VII */}
        <h2 style={S.h2}>Article VII — Confidentiality</h2>
        <p style={S.p}>Both parties shall hold all Confidential Information of the other party in strict confidence, using no less than the same degree of care applied to their own most sensitive information. &ldquo;Confidential Information&rdquo; includes: business plans, strategic intelligence, technical data, proprietary methodologies, trade secrets, algorithms, client lists, financial data, engagement terms, and all intelligence products delivered hereunder.</p>
        <p style={S.p}>Confidentiality obligations survive termination of this Agreement for a period of <strong>seven (7) years</strong> for all Confidential Information and <strong>indefinitely</strong> for trade secrets and proprietary methodologies. Neither party shall disclose Confidential Information to any third party without prior written consent of the disclosing party, except as required by law.</p>

        <hr style={S.hr} />

        {/* VIII */}
        <h2 style={S.h2}>Article VIII — Force Majeure (Acts of God)</h2>
        <p style={S.p}>Neither party shall be liable for delays or failures in performance resulting from causes beyond that party&rsquo;s reasonable control, including but not limited to: natural disasters, floods, earthquakes, fire, acts of war, civil unrest, terrorism, state-sponsored cyber warfare, distributed denial-of-service attacks, government-mandated internet shutdowns, pandemic or epidemic, changes in applicable law or government orders, or failure of critical third-party infrastructure.</p>
        <p style={S.p}>The affected party shall notify the other in writing within five (5) business days of the onset of the force majeure event. If the force majeure event continues for a period exceeding ninety (90) days, either party may terminate this Agreement without liability upon written notice, except for payment obligations for services already rendered.</p>

        <hr style={S.hr} />

        {/* IX */}
        <h2 style={S.h2}>Article IX — Dispute Resolution &amp; Jurisdiction</h2>
        <p style={S.p}>All disputes, controversies, or claims arising out of or in connection with this Agreement — including its validity, breach, interpretation, or termination — shall be finally and exclusively resolved by binding arbitration under the Arbitration and Conciliation Act, 1996 (as amended).</p>
        <ul style={S.ul}>
          <li style={S.li}><strong>Arbitrator:</strong> A sole arbitrator mutually agreed by the parties, or in absence of agreement, appointed by the High Court of Allahabad upon application by either party.</li>
          <li style={S.li}><strong>Seat &amp; Venue:</strong> Greater Noida, Uttar Pradesh, India.</li>
          <li style={S.li}><strong>Language:</strong> English.</li>
          <li style={S.li}><strong>Award:</strong> Final, binding, and enforceable. The arbitral award may be enforced as a decree of court.</li>
          <li style={S.li}><strong>IP Exception:</strong> RiskFortress retains the right to seek immediate injunctive or equitable relief from a court of competent jurisdiction for any actual or threatened breach of intellectual property rights or confidentiality obligations, without prejudice to arbitration.</li>
        </ul>
        <p style={S.p}>This Agreement is governed by the laws of the <strong>Republic of India</strong>. For matters not subject to arbitration, the courts at Greater Noida, Uttar Pradesh shall have exclusive jurisdiction.</p>

        <hr style={S.hr} />

        {/* X */}
        <h2 style={S.h2}>Article X — General Provisions</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>Entire Agreement:</strong> This MSA, together with the applicable Statement of Work, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, warranties, and understandings.</li>
          <li style={S.li}><strong>Severability:</strong> If any provision of this Agreement is found to be invalid, illegal, or unenforceable by a competent court, the remaining provisions shall continue in full force and effect.</li>
          <li style={S.li}><strong>Waiver:</strong> No failure or delay by RiskFortress in exercising any right shall constitute a waiver thereof. Any waiver must be in writing and signed by an authorized representative of RiskFortress.</li>
          <li style={S.li}><strong>Assignment:</strong> Client may not assign, transfer, or delegate any rights or obligations under this Agreement without RiskFortress&rsquo;s prior written consent. RiskFortress may freely assign this Agreement to any affiliate, successor, or acquirer.</li>
          <li style={S.li}><strong>Notices:</strong> All formal notices shall be delivered by hand, registered post with acknowledgement due, or encrypted email to the addresses on record. Notices are effective on receipt.</li>
          <li style={S.li}><strong>Amendments:</strong> No amendment to this Agreement is valid unless made in writing and signed by duly authorized representatives of both parties.</li>
        </ul>

        <hr style={S.hr} />

        {/* XI */}
        <h2 style={S.h2}>Article XI — Acceptance</h2>
        <div style={S.box}>
          <p style={{...S.p, marginBottom:'12px'}}><strong style={S.gold}>BY ENGAGING RISKFORTRESS SERVICES</strong> — through execution of a Statement of Work, submission of a secure intake form, making any advance payment, or providing written confirmation of engagement — the Client unconditionally acknowledges that they have read, understood, and agree to be legally bound by all terms of this Master Service Agreement.</p>
          <p style={{...S.p, marginBottom:'12px'}}>The Client further warrants that: (a) they possess full legal authority to enter into this Agreement and bind their organization; (b) no representation, promise, or warranty outside this Agreement has induced their acceptance; and (c) all information provided to RiskFortress is true, complete, and accurate to the best of their knowledge.</p>
          <p style={{...S.p, marginBottom:0, color:'#888', fontSize:'13px'}}>For queries regarding this Agreement, contact: <a href="mailto:[email protected]" style={{color:'#C9A84C'}}>[email protected]</a></p>
        </div>

        <hr style={S.hr} />

        <footer style={S.foot}>
          <p><strong style={{color:'#C9A84C'}}>RiskFortress Intelligence</strong></p>
          <p>A Mayalok Ventures Entity &nbsp;|&nbsp; DPIIT Registered</p>
          <p>Intelligence Node: Greater Noida, NCR, India</p>
          <p style={{marginTop:'12px'}}>
            <a href="/privacy" style={S.flink}>Privacy Protocols</a>
            <a href="/terms" style={S.flink}>Master Service Agreement</a>
          </p>
          <p style={{marginTop:'12px', fontSize:'12px', color:'#444'}}>&copy; 2026 Mayalok Ventures. All rights reserved.</p>
        </footer>

      </div>
    </div>
  )
}
