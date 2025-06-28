import { Assessment } from '../types/assessment';

interface SymptomWeight {
  [key: string]: number;
}

const SYMPTOM_WEIGHTS: SymptomWeight = {
  ulcers: 5,
  skin_discoloration: 4,
  bulging_veins: 3,
  pain_and_heaviness: 3,
  spider_veins: 2,
  long_hours: 1,
  dvt_history: 4,
  family_history: 2
};

export function calculateRiskLevel(assessment: Partial<Assessment>): {
  riskLevel: string;
  confidence: number;
  severity: number;
} {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let relevantFactors = 0;

  // Calculate weighted score
  Object.entries(SYMPTOM_WEIGHTS).forEach(([symptom, weight]) => {
    if (assessment[symptom as keyof Assessment] === 'yes') {
      totalScore += weight;
      relevantFactors++;
    }
    maxPossibleScore += weight;
  });

  // Calculate severity (0-4)
  const severity = Math.min(4, Math.floor((totalScore / maxPossibleScore) * 4));

  // Calculate confidence score (0-1)
  const confidence = relevantFactors / Object.keys(SYMPTOM_WEIGHTS).length;

  // Determine risk level
  let riskLevel = 'Low';
  if (totalScore >= maxPossibleScore * 0.7) {
    riskLevel = 'High';
  } else if (totalScore >= maxPossibleScore * 0.4) {
    riskLevel = 'Medium';
  }

  return {
    riskLevel,
    confidence: parseFloat(confidence.toFixed(2)),
    severity
  };
}

export function generateTreatmentPlan(assessment: Partial<Assessment>): Assessment['treatment_plan'] {
  const { riskLevel } = calculateRiskLevel(assessment);
  
  const basePlan = {
    lifestyle_changes: [
      'Regular exercise',
      'Maintain healthy weight',
      'Avoid prolonged standing/sitting',
      'Elevate legs when resting'
    ],
    follow_up_schedule: '3 months'
  };

  switch (riskLevel) {
    case 'High':
      return {
        ...basePlan,
        recommended_treatments: [
          'Endovenous Laser Treatment (EVLT)',
          'VenaSeal Closure System',
          'Radiofrequency Ablation (RFA)'
        ],
        medications: [
          'Prescribed compression stockings',
          'Anti-inflammatory medication'
        ],
        follow_up_schedule: '2 weeks'
      };
    case 'Medium':
      return {
        ...basePlan,
        recommended_treatments: [
          'Sclerotherapy',
          'Ambulatory Phlebectomy'
        ],
        medications: [
          'Compression stockings',
          'Over-the-counter pain relievers'
        ],
        follow_up_schedule: '1 month'
      };
    default:
      return {
        ...basePlan,
        recommended_treatments: [
          'Conservative management',
          'Compression therapy'
        ],
        medications: [
          'Compression stockings'
        ],
        follow_up_schedule: '3 months'
      };
  }
}