import React, { useState, useRef, useEffect } from "react";
import { X, ChevronRight, AlertCircle, Heart, Download, Video, Calendar, ArrowRight, AlertTriangle, AlertOctagon, Bot, Send, MapPin, Upload, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from 'react-textarea-autosize';
import { supabase } from "../lib/supabase";

interface QuestionnaireFormProps {
  onClose: () => void;
}

interface Message {
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface PhotoAnalysisResult {
  severity: number;
  findings: string[];
  recommendations: string[];
  confidence: number;
  report_url?: string;
  analysis_id?: string;
}

// List of major Indian cities
const indianCities = [
  "Ahmedabad",
  "Bangalore",
  "Bhopal",
  "Chandigarh",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Nagpur",
  "Pune",
  "Surat",
  "Thane",
  "Vadodara",
  "Visakhapatnam"
].sort();

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    location: "",
  });
  const [answers, setAnswers] = useState({
    spiderVeins: "",
    painAndHeaviness: "",
    bulgingVeins: "",
    skinDiscoloration: "",
    ulcers: "",
    duration: "",
    longHours: "",
    dvtHistory: "",
    familyHistory: "",
    previousTreatments: [] as string[],
    existingConditions: [] as string[],
    medications: [] as string[]
  });
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    location: "",
    symptoms: "",
  });
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showExternalRedirect, setShowExternalRedirect] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [waitingForReturn, setWaitingForReturn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      question: "Do you have thin, web-like veins visible on your legs?",
      field: "spiderVeins",
      options: ["Yes", "No"],
    },
    {
      question: "Do you experience pain or heaviness in your legs?",
      field: "painAndHeaviness",
      options: ["Yes", "No"],
    },
    {
      question: "Do your veins appear bulging or twisted?",
      field: "bulgingVeins",
      options: ["Yes", "No"],
    },
    {
      question: "Do you have dark patches or discoloration on your legs near your veins?",
      field: "skinDiscoloration",
      options: ["Yes", "No"],
    },
    {
      question: "Do you have open sores, ulcers, or non-healing wounds on your legs?",
      field: "ulcers",
      options: ["Yes", "No"],
    },
    {
      question: "How long have you been experiencing these symptoms?",
      field: "duration",
      options: ["Less than 6 months", "6-12 months", "1-2 years", "More than 2 years"],
    },
    {
      question: "Do you spend long hours standing or sitting?",
      field: "longHours",
      options: ["Yes", "No"],
    },
    {
      question: "Have you ever been diagnosed with Deep Vein Thrombosis (DVT)?",
      field: "dvtHistory",
      options: ["Yes", "No"],
    },
    {
      question: "Do you have a family history of varicose veins?",
      field: "familyHistory",
      options: ["Yes", "No"],
    },
    {
      question: "Have you tried any previous treatments for your veins?",
      field: "previousTreatments",
      options: [
        "None",
        "Compression stockings",
        "Exercise/lifestyle changes",
        "Medications",
        "Surgery",
        "Sclerotherapy",
        "Laser treatment"
      ],
      multiple: true,
    },
    {
      question: "Do you have any existing medical conditions?",
      field: "existingConditions",
      options: [
        "None",
        "Diabetes",
        "High blood pressure",
        "Heart disease",
        "Blood clotting disorders",
        "Obesity",
        "Other"
      ],
      multiple: true,
    },
    {
      question: "Are you currently taking any medications?",
      field: "medications",
      options: [
        "None",
        "Blood thinners",
        "Blood pressure medication",
        "Heart medication",
        "Hormonal medications",
        "Other"
      ],
      multiple: true,
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientInfoChange = (field: string, value: string) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    if (field === 'location') {
      setCitySearchQuery(value);
      setShowCityDropdown(true);
    }
  };

  const filteredCities = indianCities.filter(city => 
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setPatientInfo(prev => ({ ...prev, location: city }));
    setCitySearchQuery(city);
    setShowCityDropdown(false);
    setErrors(prev => ({ ...prev, location: "" }));
  };

  const addMessage = async (message: Message) => {
    setMessages(prev => [...prev, message]);
    if (message.type === 'bot') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);
    }
  };

  const handleChatOption = async (option: string) => {
    const currentQ = questions[currentQuestion];
    await addMessage({ type: 'user', content: option });
    
    if (currentQ.multiple) {
      const currentAnswers = answers[currentQ.field as keyof typeof answers] as string[] || [];
      if (option === "None") {
        handleInputChange(currentQ.field, ["None"]);
      } else {
        const updatedAnswers = currentAnswers.includes(option)
          ? currentAnswers.filter(a => a !== option && a !== "None")
          : [...currentAnswers.filter(a => a !== "None"), option];
        handleInputChange(currentQ.field, updatedAnswers);
      }
    } else {
      handleInputChange(currentQ.field.toLowerCase(), option.toLowerCase());
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextQuestion = questions[currentQuestion + 1];
      await addMessage({
        type: 'bot',
        content: nextQuestion.question,
        options: nextQuestion.options
      });
    } else {
      // Show external redirect after all questions
      await addMessage({
        type: 'bot',
        content: "Great! Now I'd like to analyze a photo of your legs to provide a more accurate assessment. I'll redirect you to our specialized AI photo analysis system where you can upload your photo and get detailed results."
      });
      setShowExternalRedirect(true);
    }
  };

  const handleExternalRedirect = () => {
    // Create a unique session ID for tracking
    const sessionId = `qureplus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare data to send to external API
    const assessmentData = {
      sessionId,
      patientInfo,
      symptoms: answers,
      timestamp: new Date().toISOString(),
      returnUrl: window.location.origin
    };

    // Store data in localStorage for when user returns
    localStorage.setItem('qureplus_assessment', JSON.stringify(assessmentData));
    
    // Construct URL with query parameters
    const externalUrl = new URL('https://varicose-veins.vercel.app/');
    externalUrl.searchParams.set('session', sessionId);
    externalUrl.searchParams.set('patient', patientInfo.name);
    externalUrl.searchParams.set('return', window.location.origin);
    
    // Open external API in new tab
    const newWindow = window.open(externalUrl.toString(), '_blank');
    
    if (newWindow) {
      setWaitingForReturn(true);
      setShowExternalRedirect(false);
      
      addMessage({
        type: 'bot',
        content: "I've opened our AI photo analysis system in a new tab. Please upload your photo there and complete the analysis. Once you're done, you can return here to see your complete assessment results."
      });

      // Listen for messages from the external window
      const handleMessage = (event: MessageEvent) => {
        if (event.origin === 'https://varicose-veins.vercel.app') {
          if (event.data.type === 'ANALYSIS_COMPLETE') {
            setPhotoAnalysisResult(event.data.result);
            setWaitingForReturn(false);
            calculateAndShowResults(event.data.result);
            window.removeEventListener('message', handleMessage);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if window is closed without completing analysis
      const checkClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkClosed);
          if (waitingForReturn) {
            addMessage({
              type: 'bot',
              content: "It looks like you closed the analysis window. Would you like to continue with your assessment based on the questionnaire responses, or try the photo analysis again?"
            });
            setWaitingForReturn(false);
            setShowExternalRedirect(true);
          }
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
    } else {
      // Popup blocked - provide direct link
      addMessage({
        type: 'bot',
        content: `It seems your browser blocked the popup. Please click this link to open our AI photo analysis system: ${externalUrl.toString()}\n\nAfter completing your analysis, return here to see your results.`
      });
    }
  };

  const handleSkipPhotoAnalysis = () => {
    setShowExternalRedirect(false);
    setWaitingForReturn(false);
    addMessage({
      type: 'bot',
      content: "No problem! I'll proceed with your assessment based on your questionnaire responses."
    });
    calculateAndShowResults();
  };

  const calculateSeverity = (photoResult?: PhotoAnalysisResult) => {
    // If we have photo analysis, use that severity
    if (photoResult?.severity !== undefined) {
      return photoResult.severity;
    }

    // Fallback to questionnaire-based calculation
    if (answers.ulcers === "yes") return 4;
    if (answers.bulgingVeins === "yes" || answers.skinDiscoloration === "yes") return 3;
    if (answers.painAndHeaviness === "yes") return 2;
    if (answers.spiderVeins === "yes") return 1;
    return 0;
  };

  const getStageInfo = (severity: number, photoResult?: PhotoAnalysisResult) => {
    const baseStages = {
      4: {
        title: "Stage 4 – Non-Healing Ulcers or Chronic Venous Insufficiency",
        description: "You have leg ulcers, open wounds, or venous eczema. This is the most serious stage and needs immediate medical attention.",
        color: "red",
        icon: <AlertOctagon className="h-8 w-8 text-red-500" />,
        treatments: [
          "Wound care and ulcer management",
          "Laser or surgical vein treatment",
          "Long-term compression therapy & monitoring"
        ],
        actions: [
          { label: "Book Urgent Care Consult", icon: <Calendar />, primary: true },
          { label: "Find Nearest Clinic", icon: <ArrowRight /> },
          { label: "Begin Wound Care Protocol", icon: <AlertTriangle /> }
        ]
      },
      3: {
        title: "Stage 3 – Advanced Varicose Veins",
        description: "You have bulging veins or skin changes. This is a serious condition that requires prompt medical attention to prevent complications.",
        color: "orange",
        icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
        treatments: [
          "Endovenous ablation (laser/RFA)",
          "Phlebectomy (removal of affected veins)",
          "Skin care + medical compression therapy"
        ],
        actions: [
          { label: "Book In-Person Consultation", icon: <Calendar />, primary: true },
          { label: "Get Treatment Plan", icon: <ArrowRight /> },
          { label: "Schedule Within 2-3 Weeks", icon: <AlertTriangle /> }
        ]
      },
      2: {
        title: "Stage 2 – Moderate Symptoms",
        description: "You're experiencing pain and heaviness in your legs. Early intervention can prevent progression to more severe stages.",
        color: "yellow",
        icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
        treatments: [
          "Sclerotherapy or foam injections",
          "Endovenous Laser Therapy (EVLT)",
          "Radiofrequency Ablation (RFA)"
        ],
        actions: [
          { label: "Book Video Consultation", icon: <Video />, primary: true },
          { label: "Get Doppler Ultrasound", icon: <ArrowRight /> },
          { label: "Visit Clinic", icon: <Calendar /> }
        ]
      },
      1: {
        title: "Stage 1 – Spider Veins / Mild Symptoms",
        description: "You have visible spider veins or light aching in your legs. These symptoms are usually cosmetic but may progress.",
        color: "blue",
        icon: <AlertCircle className="h-8 w-8 text-blue-500" />,
        treatments: [
          "Lifestyle changes (walking, leg elevation)",
          "Sclerotherapy (non-surgical injection)",
          "Medical-grade compression stockings"
        ],
        actions: [
          { label: "Book Consultation", icon: <Calendar />, primary: true },
          { label: "Explore Treatments", icon: <ArrowRight /> }
        ]
      },
      0: {
        title: "Stage 0 – No Visible Signs",
        description: "You don't have visible varicose veins or typical symptoms, but you might be at risk due to lifestyle, genetics, or early sensations.",
        color: "green",
        icon: <Heart className="h-8 w-8 text-green-500" />,
        treatments: [
          "Monitor symptoms every 6 months",
          "Wear compression socks if needed",
          "Maintain a healthy lifestyle"
        ],
        actions: [
          { label: "Download Prevention Tips", icon: <Download />, primary: true },
          { label: "Schedule Check-up", icon: <Calendar /> }
        ]
      }
    };

    const stageInfo = baseStages[severity as keyof typeof baseStages];
    
    // If we have photo analysis results, enhance the description
    if (photoResult && photoResult.findings.length > 0) {
      return {
        ...stageInfo,
        description: `${stageInfo.description}\n\nAI Photo Analysis: ${photoResult.findings.join(', ')}`,
        treatments: [...stageInfo.treatments, ...photoResult.recommendations]
      };
    }

    return stageInfo;
  };

  const calculateAndShowResults = async (photoResult?: PhotoAnalysisResult) => {
    const severity = calculateSeverity(photoResult);
    const stageInfo = getStageInfo(severity, photoResult);
    
    await addMessage({
      type: 'bot',
      content: `Based on your responses${photoResult ? ' and AI photo analysis' : ''}, I've completed your assessment. Here are your results:\n\n${stageInfo.title}\n\n${stageInfo.description}`
    });

    setStep(3);
    saveAssessment(photoResult);
  };

  const saveAssessment = async (photoResult?: PhotoAnalysisResult) => {
    const severity = calculateSeverity(photoResult);
    const stageInfo = getStageInfo(severity, photoResult);

    try {
      const assessmentData = {
        spider_veins: answers.spiderVeins,
        pain_and_heaviness: answers.painAndHeaviness,
        bulging_veins: answers.bulgingVeins,
        skin_discoloration: answers.skinDiscoloration,
        ulcers: answers.ulcers,
        duration: answers.duration,
        long_hours: answers.longHours,
        dvt_history: answers.dvtHistory,
        family_history: answers.familyHistory,
        previous_treatments: answers.previousTreatments,
        existing_conditions: answers.existingConditions,
        medications: answers.medications,
        severity_level: severity,
        recommendation: stageInfo.description,
        patient_name: patientInfo.name,
        patient_age: parseInt(patientInfo.age),
        patient_location: patientInfo.location,
      };

      // Add photo analysis data if available
      if (photoResult) {
        Object.assign(assessmentData, {
          image_analysis_results: photoResult,
          image_analysis_confidence: photoResult.confidence,
          image_analysis_timestamp: new Date().toISOString()
        });
      }

      const { error } = await supabase.from("assessments").insert([assessmentData]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };

  const validateStep1 = () => {
    const newErrors = {
      name: "",
      age: "",
      location: "",
    };

    if (!patientInfo.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!patientInfo.age) {
      newErrors.age = "Age is required";
    }
    if (!patientInfo.location.trim()) {
      newErrors.location = "City is required";
    } else if (!indianCities.includes(patientInfo.location)) {
      newErrors.location = "Please select a valid Indian city";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const startChat = async () => {
    setMessages([]);
    await addMessage({
      type: 'bot',
      content: `Hi ${patientInfo.name}! I'm your AI health assistant. I'll help assess your vein health through a series of questions. Let's begin!\n\n${questions[0].question}`,
      options: questions[0].options
    });
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = validateStep1();
      if (isValid) {
        setStep(2);
        startChat();
      }
    }
  };

  const renderExternalRedirect = () => (
    <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center mb-4">
        <ExternalLink className="h-6 w-6 text-blue-600 mr-2" />
        <h4 className="text-lg font-semibold text-blue-900">AI Photo Analysis</h4>
      </div>
      <p className="text-blue-800 mb-4">
        To provide you with the most accurate assessment, I'll redirect you to our specialized AI photo analysis system. This will allow you to upload your photo and receive detailed visual analysis.
      </p>
      
      <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
        <h5 className="font-semibold text-blue-900 mb-2">What happens next:</h5>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
          <li>Click the button below to open our AI analysis system</li>
          <li>Upload a clear photo of your legs showing the affected area</li>
          <li>Wait for the AI to analyze your photo (usually takes 1-2 minutes)</li>
          <li>Review your detailed analysis report</li>
          <li>Return here to see your complete assessment results</li>
        </ol>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleExternalRedirect}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Open AI Photo Analysis System
        </button>
        
        <button
          onClick={handleSkipPhotoAnalysis}
          className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Skip Photo Analysis & Continue
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> The photo analysis system will open in a new tab. Please keep this window open to return and see your complete results.
        </p>
      </div>
    </div>
  );

  const renderWaitingForReturn = () => (
    <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center mb-4">
        <Loader2 className="h-6 w-6 text-green-600 mr-2 animate-spin" />
        <h4 className="text-lg font-semibold text-green-900">Waiting for Analysis Results</h4>
      </div>
      <p className="text-green-800 mb-4">
        Please complete your photo analysis in the other tab and return here to see your complete assessment results.
      </p>
      
      <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
        <h5 className="font-semibold text-green-900 mb-2">If you're having trouble:</h5>
        <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
          <li>Make sure the analysis tab is still open</li>
          <li>Complete the photo upload and wait for results</li>
          <li>The results will automatically appear here when ready</li>
        </ul>
      </div>

      <button
        onClick={handleSkipPhotoAnalysis}
        className="w-full flex items-center justify-center px-4 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
      >
        Continue Without Photo Analysis
      </button>
    </div>
  );

  const renderResults = () => {
    const severity = calculateSeverity(photoAnalysisResult || undefined);
    const stageInfo = getStageInfo(severity, photoAnalysisResult || undefined);
    const colorClasses = {
      red: "bg-red-50 border-red-200",
      orange: "bg-orange-50 border-orange-200",
      yellow: "bg-yellow-50 border-yellow-200",
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
    };

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg border ${colorClasses[stageInfo.color as keyof typeof colorClasses]}`}>
          <div className="flex items-center mb-4">
            {stageInfo.icon}
            <div className="ml-3">
              <h3 className="text-xl font-bold text-gray-900">{stageInfo.title}</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-line">{stageInfo.description}</p>
            </div>
          </div>

          {photoAnalysisResult && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">AI Photo Analysis Results:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium">Confidence:</span> {Math.round(photoAnalysisResult.confidence * 100)}%
                </div>
                <div>
                  <span className="font-medium">Severity Level:</span> {photoAnalysisResult.severity}/4
                </div>
              </div>
              {photoAnalysisResult.findings.length > 0 && (
                <div className="mb-3">
                  <span className="font-medium text-sm">Findings:</span>
                  <ul className="text-sm text-gray-600 mt-1">
                    {photoAnalysisResult.findings.map((finding, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {photoAnalysisResult.report_url && (
                <div className="mt-3">
                  <a
                    href={photoAnalysisResult.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Detailed Report
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Recommended Treatments:</h4>
            <ul className="space-y-2">
              {stageInfo.treatments.map((treatment, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {treatment}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-3">
            {stageInfo.actions.map((action, index) => (
              <button
                key={index}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-md transition-colors ${
                  action.primary
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border border-primary text-primary hover:bg-primary-50"
                }`}
              >
                {React.cloneElement(action.icon, { className: "h-5 w-5 mr-2" })}
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Close Assessment
          </button>
        </div>
      </div>
    );
  };

  const renderChatInterface = () => (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}
            >
              <div className={`flex items-start max-w-[80%] ${message.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                {message.type === 'bot' && (
                  <div className="flex-shrink-0 mr-3">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    message.type === 'bot'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-primary text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.options && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleChatOption(option)}
                          className="px-4 py-2 rounded-full bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {showExternalRedirect && renderExternalRedirect()}
        {waitingForReturn && renderWaitingForReturn()}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>

          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold text-primary ml-2">
                QurePlus Assessment
              </h2>
            </div>

            <div className="mb-8">
              <div className="flex justify-between">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`flex items-center ${
                      stepNumber < 3 ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step > stepNumber ? "bg-primary" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              {step === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    nextStep();
                  }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={patientInfo.name}
                      onChange={(e) =>
                        handlePatientInfoChange("name", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={patientInfo.age}
                      onChange={(e) =>
                        handlePatientInfoChange("age", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                        errors.age ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your age"
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={citySearchQuery}
                        onChange={(e) => handlePatientInfoChange("location", e.target.value)}
                        onFocus={() => setShowCityDropdown(true)}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                          errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Select your city"
                      />
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                    )}
                    {showCityDropdown && citySearchQuery && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100"
                              onClick={() => handleCitySelect(city)}
                            >
                              {city}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No cities found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </form>
              )}

              {step === 2 && renderChatInterface()}
              {step === 3 && renderResults()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;