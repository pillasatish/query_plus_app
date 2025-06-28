import React, { useState, useRef, useEffect } from "react";
import { X, ChevronRight, AlertCircle, Heart, Download, Video, Calendar, ArrowRight, AlertTriangle, AlertOctagon, Bot, Send, MapPin, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from 'react-textarea-autosize';
import { supabase } from "../lib/supabase";
import ImageUpload from "./ImageUpload";
import { uploadImage, analyzeImage } from "../lib/imageAnalysis";

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
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
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
      // Show photo upload after all questions
      await addMessage({
        type: 'bot',
        content: "Great! Now I'd like to analyze a photo of your legs to provide a more accurate assessment. Please upload a clear photo showing the affected area."
      });
      setShowPhotoUpload(true);
    }
  };

  const handlePhotoAnalysis = async (imageFile: File) => {
    setIsAnalyzingPhoto(true);
    try {
      await addMessage({
        type: 'bot',
        content: "Analyzing your photo with our AI system. This may take a moment..."
      });

      // Upload image to Supabase storage
      const imageUrl = await uploadImage(imageFile);
      
      // Analyze image using Supabase Edge Function
      const analysisResult = await analyzeImage(imageUrl, {
        patientInfo,
        symptoms: answers
      });

      // Transform the result to match expected structure
      const photoResult: PhotoAnalysisResult = {
        severity: analysisResult.severity || 0,
        findings: analysisResult.findings || [],
        recommendations: analysisResult.recommendations || [],
        confidence: analysisResult.confidence || 0.7,
        analysis_id: analysisResult.analysis_id
      };

      setPhotoAnalysisResult(photoResult);
      
      await addMessage({
        type: 'bot',
        content: `Photo analysis complete! I've analyzed your image and generated a comprehensive report. The analysis shows a severity level of ${photoResult.severity}/4 with ${Math.round(photoResult.confidence * 100)}% confidence.`
      });

      // Proceed to results
      calculateAndShowResults(photoResult);
    } catch (error) {
      console.error('Error analyzing photo:', error);
      await addMessage({
        type: 'bot',
        content: "I encountered an issue with the photo analysis. Let me proceed with the assessment based on your responses."
      });
      calculateAndShowResults();
    } finally {
      setIsAnalyzingPhoto(false);
      setShowPhotoUpload(false);
    }
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

  const renderPhotoUpload = () => (
    <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center mb-4">
        <Upload className="h-6 w-6 text-blue-600 mr-2" />
        <h4 className="text-lg font-semibold text-blue-900">AI Photo Analysis</h4>
      </div>
      <p className="text-blue-800 mb-4">
        Upload a clear photo of your legs to get AI-powered visual analysis for more accurate results.
      </p>
      
      <ImageUpload
        onAnalysisComplete={handlePhotoAnalysis}
        onError={(error) => {
          console.error('Photo upload error:', error);
          addMessage({
            type: 'bot',
            content: "There was an issue with the photo upload. Let me proceed with your assessment based on the questionnaire responses."
          });
          setShowPhotoUpload(false);
          calculateAndShowResults();
        }}
        isAnalyzing={isAnalyzingPhoto}
      />
      
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setShowPhotoUpload(false);
            addMessage({
              type: 'bot',
              content: "No problem! I'll proceed with your assessment based on your questionnaire responses."
            });
            calculateAndShowResults();
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          disabled={isAnalyzingPhoto}
        >
          Skip photo analysis and continue
        </button>
      </div>
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
        
        {showPhotoUpload && renderPhotoUpload()}
        
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