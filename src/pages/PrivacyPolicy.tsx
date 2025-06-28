import React from 'react';
import { Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">We are listening. Do write in with your concerns or feedback.</p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">CONSENT</h2>
            <p className="text-gray-600 mb-6">
              By accessing the QurePlus Website or Application or by clicking on the "I accept" button at the end of the page containing this Privacy Policy, or by providing us with your Personal Information or using the Services provided by the Website or Application, you hereby consent to the collection, storage, processing, disclosure, and transfer of your Personal Information in accordance with the provisions of this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">CHANGES TO THE PRIVACY POLICY</h2>
            <p className="text-gray-600 mb-6">
              This Privacy Policy may be updated from time to time. The Website/Application will notify you of any changes, and you will be required to accept the updated policy to continue using the Services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">PERSONAL INFORMATION COLLECTED</h2>
            <p className="text-gray-600 mb-4">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Full Name (of Patient, Caregiver, Doctor, or Health Coach)</li>
              <li>Age/Date of Birth</li>
              <li>Gender</li>
              <li>Residential Address (including country and postal code)</li>
              <li>Phone and/or mobile number</li>
              <li>Email address</li>
              <li>Health information including physical, physiological, and mental conditions</li>
              <li>Medical records, reports, test results</li>
              <li>Payment and financial data for transactions</li>
              <li>Login credentials</li>
              <li>Details provided at registration or during use of the platform</li>
              <li>Communication logs with QurePlus representatives</li>
              <li>Usage data (time, frequency, duration, features used)</li>
              <li>Device information (IP address, browser type, OS, etc.)</li>
              <li>Any other data voluntarily shared by the user</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">GRIEVANCE OFFICER</h2>
            <p className="text-gray-600 mb-2">
              For any questions, concerns, or grievances related to this Privacy Policy or your Personal Information, please contact:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-900">Grievance Officer: Yashwanth Vulchi</p>
              <div className="flex items-center mt-2">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:vulchiyashwanth@gmail.com" className="text-primary hover:text-primary-dark">
                  vulchiyashwanth@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;