import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DataDeletion = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Facebook Data Deletion</h1>
          <p className="text-gray-600 mb-6">Last updated: May 8, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Delete Your Facebook Data</h2>
              <p className="mb-4">
                If you have used Facebook to log in to our application, you can request the deletion of your data through the following methods:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-3">Option 1: Through Facebook</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Go to your Facebook Settings</li>
                  <li>Click on "Apps and Websites"</li>
                  <li>Find our app in the list</li>
                  <li>Click "Remove" to delete your data</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Option 2: Direct Request</h3>
                <p className="mb-2">Send an email to <a href="mailto:privacy@skilllink.com" className="text-skilllink-green">privacy@skilllink.com</a> with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subject: "Facebook Data Deletion Request"</li>
                  <li>Your Facebook ID or email</li>
                  <li>Your full name</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Delete</h2>
              <p className="mb-4">When you request data deletion, we will remove:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your Facebook profile information</li>
                <li>Any data collected through Facebook Login</li>
                <li>Your activity history</li>
                <li>Any stored preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
              <p className="mb-4">
                We process all data deletion requests within 30 days. You will receive a confirmation email once your data has been deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                For any questions about data deletion, please contact us at:
              </p>
              <p>
                Email: privacy@skilllink.com<br />
                Phone: (555) 123-4567
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DataDeletion;
