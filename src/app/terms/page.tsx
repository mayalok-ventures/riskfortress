import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Master Service Agreement & Terms of Use | RiskFortress',
    description: 'Terms of Service and Master Service Agreement for RiskFortress Intelligence services.',
}

export default function TermsOfService() {
    const effectiveDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="min-h-screen bg-white py-32 select-none" style={{ userSelect: 'none' }}>
            <div className="max-w-4xl mx-auto px-8">
                <article className="legal-document font-serif text-gray-900" style={{ fontFamily: 'Times New Roman, serif', fontSize: '12px', lineHeight: '1.6', textAlign: 'justify' }}>

                    <header className="text-center mb-12 border-b-2 border-gray-900 pb-8">
                        <h1 className="text-xl font-bold uppercase tracking-wide mb-4">MASTER SERVICE AGREEMENT & TERMS OF USE</h1>
                        <p className="text-sm">Effective Date: {effectiveDate}</p>
                        <p className="text-sm mt-2">Document Reference: RF/LEGAL/MSA/2024-001</p>
                        <p className="text-sm mt-1">This Agreement supersedes all prior agreements, understandings, and representations</p>
                    </header>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE I: NATURE OF SERVICES (ADVISORY CAPACITY)</h2>

                        <p className="mb-4">1.1. RiskFortress Intelligence Private Limited (hereinafter "RiskFortress," "the Company," "We," "Us," or "Our") provides strategic intelligence, risk advisory, and security consulting services (collectively, the "Services") to its clients (hereinafter "Client," "You," or "Your") in a strictly advisory and consultative capacity.</p>

                        <p className="mb-4">1.2. <strong>The Crystal Ball Disclaimer:</strong> RiskFortress provides Predictive Intelligence based on probabilistic modeling, statistical analysis, historical pattern recognition, and expert human judgment. The Client expressly acknowledges and agrees that:</p>

                        <p className="mb-4">1.2.1. All risk assessments, threat forecasts, and intelligence products are inherently probabilistic in nature and represent the Company's best professional judgment based on available information at the time of assessment;</p>

                        <p className="mb-4">1.2.2. RiskFortress does not and cannot guarantee the prevention, prediction, or mitigation of all threats, losses, damages, or adverse events, whether foreseeable or unforeseeable;</p>

                        <p className="mb-4">1.2.3. The occurrence or non-occurrence of predicted events, threats, or risks does not constitute a breach of this Agreement or any warranty, express or implied;</p>

                        <p className="mb-4">1.2.4. Acts of God, force majeure events, novel threat vectors, and unprecedented circumstances are inherently beyond the scope of predictive intelligence;</p>

                        <p className="mb-4">1.2.5. The Client retains sole and absolute responsibility for all business decisions, security measures implemented, and actions taken or not taken based upon the intelligence and recommendations provided by RiskFortress.</p>

                        <p className="mb-4">1.3. RiskFortress does not provide legal advice, and nothing in our reports, assessments, or recommendations shall be construed as legal counsel. Clients are advised to seek independent legal advice for all matters requiring legal interpretation or action.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE II: INTELLECTUAL PROPERTY RIGHTS</h2>

                        <p className="mb-4">2.1. All Dossiers, Risk Maps, Threat Assessments, Intelligence Reports, Analytical Frameworks, Methodologies, Algorithms, Software, Templates, and any other deliverables created or developed by RiskFortress (collectively, "Work Product") are and shall remain the exclusive intellectual property of RiskFortress Intelligence Private Limited.</p>

                        <p className="mb-4">2.2. Upon full payment of all applicable fees and subject to the terms of this Agreement, the Client is granted a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to use the Work Product solely for the Client's internal business purposes directly related to the engagement for which the Work Product was created.</p>

                        <p className="mb-4">2.3. The Client shall not, without the prior written consent of RiskFortress: (a) reproduce, copy, modify, adapt, or create derivative works from the Work Product; (b) distribute, publish, display, or transmit the Work Product to any third party; (c) sell, license, sublicense, lease, or otherwise transfer the Work Product; (d) use the Work Product for any purpose other than that for which it was created; (e) remove, obscure, or alter any proprietary notices, watermarks, or attributions contained in the Work Product; (f) reverse engineer, decompile, or disassemble any software or algorithmic components of the Work Product.</p>

                        <p className="mb-4">2.4. All proprietary methodologies, analytical frameworks, threat models, risk matrices, and intelligence collection protocols utilized by RiskFortress constitute trade secrets and confidential business information of the Company and are protected under applicable intellectual property laws including the Indian Copyright Act, 1957, the Patents Act, 1970, and common law principles of trade secret protection.</p>

                        <p className="mb-4">2.5. Upon termination of this Agreement or expiration of the license period, whichever occurs first, the Client shall cease all use of the Work Product and, upon request, certify the destruction or return of all copies in the Client's possession, custody, or control.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE III: LIMITATION OF LIABILITY</h2>

                        <p className="mb-4 p-4 border-2 border-gray-900 bg-gray-100 font-bold uppercase text-center" style={{ fontSize: '11px' }}>
                            IN NO EVENT SHALL RISKFORTRESS, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, CONTRACTORS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF RISKFORTRESS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), ARISING OUT OF OR IN CONNECTION WITH: (A) THE USE OR INABILITY TO USE THE SERVICES; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY; (C) ANY CONTENT OBTAINED FROM OR THROUGH THE SERVICES; (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT; (E) THE OCCURRENCE OR NON-OCCURRENCE OF PREDICTED EVENTS; OR (F) ANY OTHER MATTER RELATING TO THE SERVICES.
                        </p>

                        <p className="mb-4 p-4 border-2 border-gray-900 bg-gray-100 font-bold uppercase text-center" style={{ fontSize: '11px' }}>
                            THE MAXIMUM AGGREGATE LIABILITY OF RISKFORTRESS AND ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT OR THE SERVICES, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY THE CLIENT TO RISKFORTRESS DURING THE SIX (6) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
                        </p>

                        <p className="mb-4">3.3. The limitations of liability set forth in this Article III shall apply to the fullest extent permitted by applicable law, regardless of: (a) the failure of essential purpose of any limited remedy; (b) the negligence, gross negligence, or willful misconduct of RiskFortress; or (c) any fundamental breach of this Agreement by RiskFortress.</p>

                        <p className="mb-4">3.4. The Client acknowledges that the fees charged by RiskFortress reflect the allocation of risk set forth in this Agreement and that RiskFortress would not enter into this Agreement without the limitations of liability contained herein.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE IV: INDEMNIFICATION</h2>

                        <p className="mb-4">4.1. The Client agrees to defend, indemnify, and hold harmless RiskFortress, its parent companies, subsidiaries, affiliates, directors, officers, employees, agents, contractors, and licensors (collectively, "Indemnified Parties") from and against any and all claims, demands, suits, actions, proceedings, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or in connection with:</p>

                        <p className="mb-4">4.1.1. The Client's use or misuse of the Services or Work Product;</p>

                        <p className="mb-4">4.1.2. The Client's breach of any representation, warranty, covenant, or obligation under this Agreement;</p>

                        <p className="mb-4">4.1.3. The Client's violation of any applicable law, regulation, or third-party right;</p>

                        <p className="mb-4">4.1.4. Any actions taken or not taken by the Client based on the intelligence, recommendations, or advice provided by RiskFortress;</p>

                        <p className="mb-4">4.1.5. Any third-party claim arising from the Client's business operations, security incidents, or risk events, regardless of whether such claim relates to the Services;</p>

                        <p className="mb-4">4.1.6. The Client's provision of false, misleading, or incomplete information to RiskFortress.</p>

                        <p className="mb-4">4.2. RiskFortress shall have the right to participate in the defense of any claim with counsel of its choosing at the Client's expense, and the Client shall not settle any claim without the prior written consent of RiskFortress.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE V: FORCE MAJEURE (ACTS OF GOD)</h2>

                        <p className="mb-4">5.1. RiskFortress shall not be liable for any failure or delay in performing its obligations under this Agreement to the extent that such failure or delay results from circumstances beyond RiskFortress's reasonable control (a "Force Majeure Event"), including but not limited to:</p>

                        <p className="mb-4">5.1.1. Acts of God, natural disasters, earthquakes, floods, hurricanes, tsunamis, volcanic eruptions, or other natural catastrophes;</p>

                        <p className="mb-4">5.1.2. War (whether declared or undeclared), armed conflict, acts of foreign enemies, invasion, hostilities, civil war, rebellion, revolution, insurrection, military or usurped power;</p>

                        <p className="mb-4">5.1.3. Civil unrest, riots, civil commotion, strikes, lockouts, labor disputes, or industrial action;</p>

                        <p className="mb-4">5.1.4. Terrorism, sabotage, or acts of malicious damage;</p>

                        <p className="mb-4">5.1.5. Cyber warfare, distributed denial-of-service attacks, ransomware attacks, or other malicious cyber activities conducted by state or non-state actors;</p>

                        <p className="mb-4">5.1.6. Government Internet shutdowns, telecommunications blackouts, or restrictions on electronic communications imposed by governmental authorities;</p>

                        <p className="mb-4">5.1.7. Pandemic, epidemic, or public health emergencies;</p>

                        <p className="mb-4">5.1.8. Changes in applicable laws, regulations, or government orders that render performance impossible or impractical;</p>

                        <p className="mb-4">5.1.9. Failure of third-party utilities, telecommunications networks, or infrastructure providers;</p>

                        <p className="mb-4">5.1.10. Nuclear, chemical, or biological contamination;</p>

                        <p className="mb-4">5.1.11. Any other circumstance beyond the reasonable control of RiskFortress.</p>

                        <p className="mb-4">5.2. In the event of a Force Majeure Event, RiskFortress shall use reasonable efforts to mitigate the impact and resume performance as soon as practicable. If the Force Majeure Event continues for more than ninety (90) days, either party may terminate this Agreement without liability.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE VI: DISPUTE RESOLUTION & JURISDICTION</h2>

                        <p className="mb-4">6.1. <strong>Binding Arbitration:</strong> Any dispute, controversy, or claim arising out of or in connection with this Agreement, including any question regarding its existence, validity, interpretation, breach, or termination (a "Dispute"), shall be referred to and finally resolved by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 (as amended), which rules are deemed to be incorporated by reference into this clause.</p>

                        <p className="mb-4">6.2. The arbitration shall be conducted by a sole arbitrator mutually agreed upon by the parties, or in the absence of such agreement within thirty (30) days, appointed in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Greater Noida, Uttar Pradesh, India.</p>

                        <p className="mb-4">6.3. The language of the arbitration shall be English. The arbitral award shall be final and binding upon the parties and may be enforced in any court of competent jurisdiction.</p>

                        <p className="mb-4">6.4. Notwithstanding the foregoing, RiskFortress shall be entitled to seek injunctive or other equitable relief from any court of competent jurisdiction to protect its intellectual property rights, confidential information, or trade secrets.</p>

                        <p className="mb-4">6.5. <strong>Governing Law:</strong> This Agreement shall be governed by and construed in accordance with the laws of the Republic of India, without regard to its conflict of laws principles.</p>

                        <p className="mb-4">6.6. Subject to the arbitration provisions above, the courts at Greater Noida, Uttar Pradesh shall have exclusive jurisdiction over any matters not subject to arbitration.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE VII: CONFIDENTIALITY</h2>

                        <p className="mb-4">7.1. Each party agrees to hold in strict confidence all Confidential Information disclosed by the other party and to use such Confidential Information solely for the purposes of this Agreement. "Confidential Information" includes all non-public information disclosed by either party, including but not limited to business plans, technical data, trade secrets, know-how, inventions, processes, techniques, algorithms, software programs, customer lists, financial information, and any other information designated as confidential or that reasonably should be understood to be confidential.</p>

                        <p className="mb-4">7.2. The obligations of confidentiality shall survive the termination of this Agreement for a period of seven (7) years, or indefinitely with respect to trade secrets.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE VIII: GENERAL PROVISIONS</h2>

                        <p className="mb-4">8.1. <strong>Entire Agreement:</strong> This Agreement, together with any Statements of Work, Order Forms, or other documents incorporated herein by reference, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written.</p>

                        <p className="mb-4">8.2. <strong>Severability:</strong> If any provision of this Agreement is held to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable, and the remaining provisions shall continue in full force and effect.</p>

                        <p className="mb-4">8.3. <strong>Waiver:</strong> No waiver of any provision of this Agreement shall be effective unless in writing and signed by the waiving party. No failure or delay in exercising any right shall operate as a waiver thereof.</p>

                        <p className="mb-4">8.4. <strong>Assignment:</strong> The Client may not assign or transfer this Agreement or any rights or obligations hereunder without the prior written consent of RiskFortress. RiskFortress may assign this Agreement without restriction.</p>

                        <p className="mb-4">8.5. <strong>Notices:</strong> All notices required or permitted under this Agreement shall be in writing and shall be delivered by hand, registered post, or email to the addresses specified in the engagement documents.</p>

                        <p className="mb-4">8.6. <strong>Amendments:</strong> This Agreement may only be amended by a written instrument signed by both parties.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-bold uppercase mb-4 border-b border-gray-400 pb-2">ARTICLE IX: ACCEPTANCE</h2>

                        <p className="mb-4">9.1. By engaging the Services of RiskFortress, whether by executing a Statement of Work, submitting an intake form, making payment, or otherwise indicating acceptance, the Client acknowledges that they have read, understood, and agreed to be bound by all terms and conditions of this Master Service Agreement.</p>

                        <p className="mb-4">9.2. The Client represents and warrants that they have the legal authority to bind their organization to this Agreement.</p>
                    </section>

                    <footer className="mt-16 pt-8 border-t-2 border-gray-900 text-center text-xs">
                        <p className="mb-2">RiskFortress Intelligence Private Limited</p>
                        <p className="mb-2">Registered Office: Pari Chowk, Greater Noida, Uttar Pradesh 201310, India</p>
                        <p className="mb-2">CIN: [To Be Assigned Upon Incorporation]</p>
                        <p className="mb-4">Legal Inquiries: legal@riskfortress.in</p>
                        <p>© {new Date().getFullYear()} RiskFortress Intelligence Private Limited. All Rights Reserved.</p>
                    </footer>
                </article>
            </div>
        </div>
    )
}
