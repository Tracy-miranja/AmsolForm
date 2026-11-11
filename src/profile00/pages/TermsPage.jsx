const SECTIONS = [
  { title: "1. Introduction", content: "Welcome to the website of Africa Management Solutions Limited (AMSOL). These terms and conditions govern your access to and use of the AMSOL website. By accessing or using this website, you agree to comply with and be bound by these terms. If you do not agree, you should discontinue using the website immediately." },
  { title: "2. Definitions", content: '"Company", "AMSOL", "we", "us", or "our" refers to Africa Management Solutions Limited. "Website" refers to the official AMSOL website. "User", "you", or "your" refers to any person accessing or using the website. "Services" refers to the consulting, recruitment, HR outsourcing, payroll management, and advisory services provided by AMSOL.' },
  { title: "3. Acceptance of Terms", content: "By accessing the website, submitting information, applying for job opportunities, or requesting services, you confirm that you have read and understood these terms, agree to comply with them, and are legally capable of entering into binding agreements. AMSOL reserves the right to deny access to users who violate these terms." },
  { title: "4. Use of the Website", content: "The website is intended to allow users to submit service inquiries, apply for job opportunities, contact the company, and access professional resources. Users agree to use the website only for lawful purposes and must not attempt unauthorized access, introduce malware, interfere with functionality, or submit false information." },
  { title: "5. Description of Services", content: "AMSOL provides Human Resource Consulting, Recruitment and Talent Acquisition, Payroll Processing and Outsourcing, HR Outsourcing Services, Organizational Development, Business Consulting, and Corporate advisory services. Information on the website is for general informational purposes only." },
  { title: "6. User Responsibilities", content: "Users who submit information agree that all information provided is accurate and truthful, they have the authority to submit the information, and they will not impersonate another individual or organization. Job applicants must ensure submitted resumes and documents are accurate and lawful." },
  { title: "7. Intellectual Property Rights", content: "All content on this website including text, graphics, logos, images, software, and documents are the property of Africa Management Solutions Limited or its licensors and are protected under applicable intellectual property laws. Users may not reproduce, distribute, or commercially exploit website content without prior written consent." },
  { title: "8. Confidentiality", content: "Any confidential information exchanged through formal engagement agreements will be handled in accordance with applicable confidentiality obligations. Information submitted through general website forms may not automatically constitute confidential communication unless specified." },
  { title: "9. Third-Party Links", content: "The website may contain links to third-party websites. AMSOL does not control or endorse these platforms and is not responsible for their content, privacy practices, or accuracy of information. Users access such links at their own risk." },
  { title: "10. Limitation of Liability", content: "To the fullest extent permitted by law, AMSOL shall not be liable for any indirect, incidental, special, or consequential damages arising from use or inability to use the website, reliance on website information, errors or omissions in content, or temporary unavailability of the website." },
  { title: "11. Disclaimer of Warranties", content: 'The website is provided "as is" and "as available". AMSOL makes no warranties regarding accuracy of information, continuous availability, freedom from errors or interruptions, or security from cyber threats.' },
  { title: "12. Indemnification", content: "Users agree to indemnify and hold harmless AMSOL and its employees, partners, and affiliates against any claims, damages, losses, or liabilities resulting from violation of these terms, misuse of the website, or submission of inaccurate or unlawful information." },
  { title: "13. Governing Law and Jurisdiction", content: "These terms shall be governed by the laws of the Republic of Kenya. Any disputes arising from the use of this website shall be subject to the jurisdiction of Kenyan courts." },
  { title: "14. Amendments to Terms", content: "AMSOL reserves the right to update or modify these terms at any time. Changes become effective upon publication on this page. Continued use of the website after updates constitutes acceptance of the revised terms." },
  { title: "15. Termination of Use", content: "AMSOL reserves the right to restrict or terminate access to the website, remove user submissions, or suspend services if users violate these terms or engage in unlawful activity." },
  { title: "16. Contact Information", content: "For questions regarding these terms, contact Africa Management Solutions Limited." },
];

export default function TermsPage() {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 800 }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "32px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1a1a2e", margin: 0 }}>Terms and Conditions</h1>
        <p style={{ fontSize: 12, color: "#9090a8", marginBottom: 28, marginTop: 6 }}>Effective Date: January 1, 2011</p>

        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>{s.title}</h3>
            <p style={{ fontSize: 13.5, color: "#5a5a72", lineHeight: 1.75, margin: 0 }}>{s.content}</p>
          </div>
        ))}

        <div style={{ marginTop: 32, padding: "16px", background: "#f0f5ff", borderRadius: 10, border: "1px solid rgba(26,110,219,0.15)", fontSize: 12.5, color: "#1a6edb" }}>
          For questions contact: <strong>info@amsol.africa</strong> ·{" "}
          <a href="https://www.amsol.africa" target="_blank" rel="noreferrer" style={{ color: "#1a6edb" }}>www.amsol.africa</a>
        </div>
      </div>
    </div>
  );
}
