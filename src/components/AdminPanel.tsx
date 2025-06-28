import React from 'react';
import { Download, Users, AlertTriangle, Calendar, Camera } from 'lucide-react';
import { getAssessments, downloadCSV } from '../utils/storage';
import { AssessmentRecord } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const assessments = getAssessments();

  const handleDownload = () => {
    downloadCSV(assessments);
  };

  const totalAssessments = assessments.length;
  const highSeverityCases = assessments.filter(a => a.severity === 'High').length;
  const averageAge = assessments.length > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.age, 0) / assessments.length * 10) / 10
    : 0;
  const withImages = assessments.filter(a => a.has_image).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-2xl card-shadow mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">📊 Assessment Data Dashboard</h2>
          <button
            onClick={onBack}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Assessment
          </button>
        </div>

        {assessments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users size={64} className="mx-auto" />
            </div>
            <p className="text-gray-600 text-lg">No assessment data available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Assessments</p>
                    <p className="text-3xl font-bold">{totalAssessments}</p>
                  </div>
                  <Users size={32} className="text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">High Severity Cases</p>
                    <p className="text-3xl font-bold">{highSeverityCases}</p>
                  </div>
                  <AlertTriangle size={32} className="text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Average Age</p>
                    <p className="text-3xl font-bold">{averageAge}</p>
                  </div>
                  <Calendar size={32} className="text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">With Images</p>
                    <p className="text-3xl font-bold">{withImages}</p>
                  </div>
                  <Camera size={32} className="text-purple-200" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Assessment Records</h3>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 btn-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                <Download size={20} />
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Severity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Visible Veins</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ulcers</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Previous Treatment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assessments.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.age}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.city}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.severity === 'High' ? 'bg-red-100 text-red-800' :
                          record.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {record.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.visible_veins}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.ulcers}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.previous_treatment}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;