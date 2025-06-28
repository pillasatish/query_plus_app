import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download } from 'lucide-react';

interface Assessment {
  id: string;
  created_at: string;
  spider_veins: string;
  pain_and_heaviness: string;
  bulging_veins: string;
  skin_discoloration: string;
  ulcers: string;
  duration: string;
  long_hours: string;
  dvt_history: string;
  family_history: string;
  previous_treatments: string[];
  severity_level: number;
  recommendation: string;
  image_url?: string;
}

const AssessmentData: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Severity Level',
      'Spider Veins',
      'Pain and Heaviness',
      'Bulging Veins',
      'Skin Discoloration',
      'Ulcers',
      'Duration',
      'Long Hours',
      'DVT History',
      'Family History',
      'Previous Treatments',
      'Recommendation',
    ];

    const csvData = assessments.map(assessment => [
      new Date(assessment.created_at).toLocaleDateString(),
      assessment.severity_level,
      assessment.spider_veins,
      assessment.pain_and_heaviness,
      assessment.bulging_veins,
      assessment.skin_discoloration,
      assessment.ulcers,
      assessment.duration,
      assessment.long_hours,
      assessment.dvt_history,
      assessment.family_history,
      assessment.previous_treatments.join('; '),
      assessment.recommendation,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'assessment_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assessment Data</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">History</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(assessment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${assessment.severity_level === 4 ? 'bg-red-100 text-red-800' :
                    assessment.severity_level === 3 ? 'bg-orange-100 text-orange-800' :
                    assessment.severity_level === 2 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>
                    Level {assessment.severity_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {assessment.spider_veins === 'yes' && <li>Spider Veins</li>}
                    {assessment.pain_and_heaviness === 'yes' && <li>Pain and Heaviness</li>}
                    {assessment.bulging_veins === 'yes' && <li>Bulging Veins</li>}
                    {assessment.skin_discoloration === 'yes' && <li>Skin Discoloration</li>}
                    {assessment.ulcers === 'yes' && <li>Ulcers</li>}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {assessment.dvt_history === 'yes' && <li>DVT History</li>}
                    {assessment.family_history === 'yes' && <li>Family History</li>}
                    {assessment.long_hours === 'yes' && <li>Long Hours Standing/Sitting</li>}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {assessment.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssessmentData;