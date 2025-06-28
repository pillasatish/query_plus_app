import { AssessmentData, AIAnalysis, Recommendations } from '../types';

export function calculateSeverity(answers: AssessmentData): [string, number] {
  let score = 0;
  
  if (answers.visible_veins === 'Yes') {
    score += 1;
  }
  if (answers.ulcers === 'Yes') {
    score += 3;
  }
  if (answers.previous_treatment === 'Yes') {
    score += 1;
  }
  
  if (score >= 3) {
    return ['High', 4];
  } else if (score >= 1) {
    return ['Medium', 2];
  } else {
    return ['Low', 1];
  }
}

export function mockAIAnalysis(image: File): AIAnalysis {
  return {
    confidence: 0.85,
    findings: {
      varicose_veins: true,
      spider_veins: false,
      skin_discoloration: false,
      ulcers: false,
      swelling: true
    },
    severity_adjustment: 1
  };
}

export function getRecommendations(severity: string, level: number): Recommendations {
  if (severity === 'High') {
    return {
      title: 'High Priority - Immediate Medical Attention Required',
      description: 'Your symptoms indicate advanced varicose veins that require prompt medical intervention.',
      treatments: [
        'Endovenous Laser Treatment (EVLT)',
        'VenaSeal Closure System',
        'Radiofrequency Ablation (RFA)',
        'Surgical intervention if necessary'
      ],
      next_steps: [
        'Schedule consultation within 1-2 weeks',
        'Get Doppler ultrasound examination',
        'Consider compression therapy immediately'
      ]
    };
  } else if (severity === 'Medium') {
    return {
      title: 'Moderate Symptoms - Treatment Recommended',
      description: 'Your symptoms suggest varicose veins that would benefit from treatment.',
      treatments: [
        'Sclerotherapy',
        'Ambulatory Phlebectomy',
        'Compression therapy',
        'Lifestyle modifications'
      ],
      next_steps: [
        'Schedule consultation within 4-6 weeks',
        'Start wearing compression stockings',
        'Implement lifestyle changes'
      ]
    };
  } else {
    return {
      title: 'Low Risk - Preventive Care',
      description: 'Your symptoms are minimal. Focus on prevention and monitoring.',
      treatments: [
        'Compression stockings',
        'Regular exercise',
        'Leg elevation',
        'Weight management'
      ],
      next_steps: [
        'Monitor symptoms regularly',
        'Maintain healthy lifestyle',
        'Consider consultation if symptoms worsen'
      ]
    };
  }
}