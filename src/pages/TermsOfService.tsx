
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-6">Last updated: May 8, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="mb-4">
                By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
              <p className="mb-4">
                SkillLink provides web development and digital marketing services, including but not limited to website design, content creation, social media management, and SEO optimization. The features and prices of our services are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="mb-4">
                To access certain services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              <p className="mb-4">
                You must provide accurate, current, and complete information during the registration process and update such information to keep it accurate, current, and complete.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
              <p className="mb-4">
                Our service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.
              </p>
              <p className="mb-4">
                By posting content to the service, you grant us the right and license to use, modify, perform, display, reproduce, and distribute such content on and through the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
              <p className="mb-4">
                For paid services, you agree to pay all fees or charges to your account based on the fees, charges, and billing terms in effect at the time a fee or charge is due and payable. You are responsible for providing current, complete, and accurate billing and contact information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="mb-4">
                The service and its original content, features, and functionality are and will remain the exclusive property of SkillLink and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of SkillLink.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="mb-4">
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall SkillLink, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of or inability to use the service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from the service</li>
                <li>Any bugs, viruses, trojan horses, or the like which may be transmitted to or through the service by any third party</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: terms@skilllink.com<br />
                Address: 123 SkillLink Way, Digital City, DC 12345
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
