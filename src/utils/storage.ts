import { AssessmentRecord } from '../types';

const STORAGE_KEY = 'qureplus_assessments';

export function saveAssessment(data: AssessmentRecord): void {
  const existingData = getAssessments();
  const updatedData = [...existingData, data];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
}

export function getAssessments(): AssessmentRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function exportToCSV(data: AssessmentRecord[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(record => 
    Object.values(record).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

export function downloadCSV(data: AssessmentRecord[], filename: string = 'assessments.csv'): void {
  const csv = exportToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}