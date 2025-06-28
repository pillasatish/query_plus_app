import streamlit as st
import pandas as pd
import json
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image
import requests
import os
from typing import Dict, List, Optional

# Configure Streamlit page
st.set_page_config(
    page_title="QurePlus - AI Vein Health Assessment",
    page_icon="💜",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 2rem 0;
        background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
        color: white;
        border-radius: 10px;
        margin-bottom: 2rem;
    }
    
    .assessment-card {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        margin: 1rem 0;
    }
    
    .severity-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: bold;
        text-align: center;
        margin: 1rem 0;
    }
    
    .severity-1 { background-color: #dbeafe; color: #1e40af; }
    .severity-2 { background-color: #fef3c7; color: #92400e; }
    .severity-3 { background-color: #fed7aa; color: #c2410c; }
    .severity-4 { background-color: #fecaca; color: #dc2626; }
    
    .stButton > button {
        width: 100%;
        background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
    
    .photo-guidelines {
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .results-container {
        background: #f8fafc;
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Indian cities list
INDIAN_CITIES = [
    "Ahmedabad", "Bangalore", "Bhopal", "Chandigarh", "Chennai", "Delhi",
    "Hyderabad", "Indore", "Jaipur", "Kolkata", "Lucknow", "Mumbai",
    "Nagpur", "Pune", "Surat", "Thane", "Vadodara", "Visakhapatnam"
]

class VeinAssessment:
    def __init__(self):
        self.questions = [
            {
                "id": "visible_veins",
                "question": "Do you see any veins visible on your legs?",
                "options": ["Yes", "No"]
            },
            {
                "id": "ulcers",
                "question": "Do you have open sores, ulcers, or non-healing wounds on your legs?",
                "options": ["Yes", "No"]
            },
            {
                "id": "previous_treatment",
                "question": "Have you done any treatment for varicose veins previously?",
                "options": ["Yes", "No"]
            }
        ]
    
    def calculate_severity(self, answers: Dict[str, str], photo_analysis: Optional[Dict] = None) -> int:
        """Calculate severity level based on answers and optional photo analysis"""
        if photo_analysis and 'severity' in photo_analysis:
            return photo_analysis['severity']
        
        # Simplified severity calculation
        if answers.get('ulcers') == 'Yes':
            return 4
        elif answers.get('visible_veins') == 'Yes' and answers.get('previous_treatment') == 'Yes':
            return 3
        elif answers.get('visible_veins') == 'Yes':
            return 2
        else:
            return 1
    
    def get_stage_info(self, severity: int) -> Dict:
        """Get stage information based on severity level"""
        stages = {
            1: {
                "title": "Stage 1 – Early Assessment / Prevention",
                "description": "Based on your responses, you may be in the early stages or at risk. Regular monitoring and preventive care are recommended.",
                "color": "severity-1",
                "treatments": [
                    "Lifestyle changes (walking, leg elevation)",
                    "Preventive compression stockings",
                    "Regular monitoring"
                ],
                "urgency": "Low"
            },
            2: {
                "title": "Stage 2 – Visible Veins Present",
                "description": "You have visible veins on your legs. Early intervention can prevent progression to more severe stages.",
                "color": "severity-2",
                "treatments": [
                    "Sclerotherapy or foam injections",
                    "Endovenous Laser Therapy (EVLT)",
                    "Compression stockings"
                ],
                "urgency": "Medium"
            },
            3: {
                "title": "Stage 3 – Advanced Varicose Veins with Previous Treatment",
                "description": "You have visible veins and have tried treatments before. This suggests a more complex condition that may require advanced intervention.",
                "color": "severity-3",
                "treatments": [
                    "Endovenous ablation (laser/RFA)",
                    "Phlebectomy (removal of affected veins)",
                    "Advanced compression therapy"
                ],
                "urgency": "High"
            },
            4: {
                "title": "Stage 4 – Non-Healing Ulcers or Chronic Venous Insufficiency",
                "description": "You have leg ulcers, open wounds, or venous eczema. This is the most serious stage and needs immediate medical attention.",
                "color": "severity-4",
                "treatments": [
                    "Wound care and ulcer management",
                    "Laser or surgical vein treatment",
                    "Long-term compression therapy & monitoring"
                ],
                "urgency": "Urgent"
            }
        }
        return stages.get(severity, stages[1])

def analyze_photo_with_ai(image: Image.Image, patient_info: Dict, symptoms: Dict) -> Dict:
    """
    Analyze uploaded photo using AI (mock implementation)
    In production, this would call an actual AI service
    """
    # Mock AI analysis - replace with actual AI service call
    import random
    
    # Simulate AI processing time
    import time
    time.sleep(2)
    
    # Generate mock analysis based on symptoms
    severity = 1
    findings = []
    
    if symptoms.get('ulcers') == 'Yes':
        severity = 4
        findings.append("Potential ulcers or wounds detected")
    elif symptoms.get('visible_veins') == 'Yes':
        severity = 2 if symptoms.get('previous_treatment') == 'No' else 3
        findings.append("Visible vein patterns detected")
    
    # Add some randomness to simulate AI variability
    confidence = random.uniform(0.75, 0.95)
    
    return {
        "severity": severity,
        "confidence": confidence,
        "findings": findings,
        "recommendations": [
            "Consult with a vein specialist",
            "Consider compression therapy",
            "Monitor symptoms regularly"
        ],
        "analysis_timestamp": datetime.now().isoformat()
    }

def save_assessment_data(patient_info: Dict, answers: Dict, severity: int, stage_info: Dict, photo_analysis: Optional[Dict] = None):
    """Save assessment data to CSV file"""
    assessment_data = {
        "timestamp": datetime.now().isoformat(),
        "patient_name": patient_info.get("name", ""),
        "patient_age": patient_info.get("age", ""),
        "patient_location": patient_info.get("location", ""),
        "visible_veins": answers.get("visible_veins", ""),
        "ulcers": answers.get("ulcers", ""),
        "previous_treatment": answers.get("previous_treatment", ""),
        "severity_level": severity,
        "stage_title": stage_info["title"],
        "urgency": stage_info["urgency"],
        "photo_analyzed": "Yes" if photo_analysis else "No",
        "ai_confidence": photo_analysis.get("confidence", 0) if photo_analysis else 0
    }
    
    # Create DataFrame and save to CSV
    df = pd.DataFrame([assessment_data])
    
    # Append to existing file or create new one
    try:
        existing_df = pd.read_csv("assessments.csv")
        df = pd.concat([existing_df, df], ignore_index=True)
    except FileNotFoundError:
        pass
    
    df.to_csv("assessments.csv", index=False)

def main():
    # Initialize session state
    if 'step' not in st.session_state:
        st.session_state.step = 1
    if 'patient_info' not in st.session_state:
        st.session_state.patient_info = {}
    if 'answers' not in st.session_state:
        st.session_state.answers = {}
    if 'photo_analysis' not in st.session_state:
        st.session_state.photo_analysis = None
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>💜 QurePlus</h1>
        <h3>AI-Powered Vein Health Assessment</h3>
        <p>Quick 3-question assessment with optional AI photo analysis</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Progress indicator
    progress_steps = ["Patient Info", "Assessment", "Results"]
    cols = st.columns(3)
    for i, step_name in enumerate(progress_steps):
        with cols[i]:
            if st.session_state.step > i + 1:
                st.success(f"✅ {step_name}")
            elif st.session_state.step == i + 1:
                st.info(f"📍 {step_name}")
            else:
                st.write(f"⭕ {step_name}")
    
    st.markdown("---")
    
    # Step 1: Patient Information
    if st.session_state.step == 1:
        st.markdown('<div class="assessment-card">', unsafe_allow_html=True)
        st.header("📋 Patient Information")
        
        with st.form("patient_info_form"):
            col1, col2 = st.columns(2)
            
            with col1:
                name = st.text_input("Full Name *", value=st.session_state.patient_info.get("name", ""))
                age = st.number_input("Age *", min_value=1, max_value=120, value=st.session_state.patient_info.get("age", 25))
            
            with col2:
                location = st.selectbox("City *", [""] + INDIAN_CITIES, 
                                      index=INDIAN_CITIES.index(st.session_state.patient_info.get("location", "")) + 1 
                                      if st.session_state.patient_info.get("location") in INDIAN_CITIES else 0)
            
            submitted = st.form_submit_button("Start Assessment")
            
            if submitted:
                if name and age and location:
                    st.session_state.patient_info = {
                        "name": name,
                        "age": age,
                        "location": location
                    }
                    st.session_state.step = 2
                    st.rerun()
                else:
                    st.error("Please fill in all required fields.")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Step 2: Assessment Questions
    elif st.session_state.step == 2:
        st.markdown('<div class="assessment-card">', unsafe_allow_html=True)
        st.header(f"🤖 AI Assessment for {st.session_state.patient_info['name']}")
        
        assessment = VeinAssessment()
        
        with st.form("assessment_form"):
            st.write("Please answer these 3 simple questions:")
            
            answers = {}
            for question in assessment.questions:
                st.subheader(question["question"])
                answers[question["id"]] = st.radio(
                    "Select your answer:",
                    question["options"],
                    key=question["id"],
                    horizontal=True
                )
                st.write("")
            
            submitted = st.form_submit_button("Complete Assessment")
            
            if submitted:
                st.session_state.answers = answers
                st.session_state.step = 3
                st.rerun()
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Step 3: Photo Analysis (Optional)
    elif st.session_state.step == 3:
        if st.session_state.photo_analysis is None:
            st.markdown('<div class="assessment-card">', unsafe_allow_html=True)
            st.header("📸 AI Photo Analysis (Optional)")
            st.write("Upload a photo of your legs for advanced AI analysis to improve accuracy.")
            
            # Photo guidelines
            st.markdown("""
            <div class="photo-guidelines">
                <h4>📋 Photo Guidelines for Best Results:</h4>
                <ul>
                    <li>Ensure good lighting and clear visibility</li>
                    <li>Show both legs from knee to ankle</li>
                    <li>Stand straight with legs slightly apart</li>
                    <li>Avoid shadows, reflections, or obstructions</li>
                    <li>Remove socks, stockings, or tight clothing</li>
                    <li>Take photo from a comfortable distance (2-3 feet)</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)
            
            uploaded_file = st.file_uploader(
                "Choose an image file",
                type=['png', 'jpg', 'jpeg'],
                help="Upload a clear photo of your legs for AI analysis"
            )
            
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button("🔍 Analyze Photo with AI") and uploaded_file:
                    with st.spinner("🤖 AI is analyzing your photo..."):
                        # Display uploaded image
                        image = Image.open(uploaded_file)
                        st.image(image, caption="Uploaded Image", use_column_width=True)
                        
                        # Perform AI analysis
                        photo_analysis = analyze_photo_with_ai(
                            image, 
                            st.session_state.patient_info, 
                            st.session_state.answers
                        )
                        st.session_state.photo_analysis = photo_analysis
                        st.success("✅ AI analysis complete!")
                        st.rerun()
            
            with col2:
                if st.button("⏭️ Skip Photo Analysis"):
                    st.session_state.step = 4
                    st.rerun()
            
            st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.session_state.step = 4
            st.rerun()
    
    # Step 4: Results
    elif st.session_state.step == 4:
        assessment = VeinAssessment()
        severity = assessment.calculate_severity(st.session_state.answers, st.session_state.photo_analysis)
        stage_info = assessment.get_stage_info(severity)
        
        st.markdown('<div class="results-container">', unsafe_allow_html=True)
        st.header("📊 Your Assessment Results")
        
        # Severity badge
        st.markdown(f"""
        <div class="severity-badge {stage_info['color']}">
            {stage_info['title']}
        </div>
        """, unsafe_allow_html=True)
        
        # Description
        st.write(stage_info['description'])
        
        # Photo analysis results if available
        if st.session_state.photo_analysis:
            st.subheader("🤖 AI Photo Analysis Results")
            col1, col2 = st.columns(2)
            with col1:
                st.metric("AI Confidence", f"{st.session_state.photo_analysis['confidence']:.1%}")
            with col2:
                st.metric("Severity Level", f"{severity}/4")
            
            if st.session_state.photo_analysis.get('findings'):
                st.write("**Findings:**")
                for finding in st.session_state.photo_analysis['findings']:
                    st.write(f"• {finding}")
        
        # Treatment recommendations
        st.subheader("💊 Recommended Treatments")
        for treatment in stage_info['treatments']:
            st.write(f"• {treatment}")
        
        # Urgency level
        urgency_colors = {
            "Low": "🟢",
            "Medium": "🟡", 
            "High": "🟠",
            "Urgent": "🔴"
        }
        st.subheader(f"{urgency_colors.get(stage_info['urgency'], '⚪')} Treatment Urgency: {stage_info['urgency']}")
        
        # Action buttons
        st.subheader("📞 Next Steps")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if st.button("📞 Book Consultation"):
                st.info("Call: +91 7093765543")
        
        with col2:
            if st.button("💬 Video Consultation"):
                st.info("Video consultation available for ₹499")
        
        with col3:
            if st.button("🏥 Find Clinic"):
                st.info("Locate nearest QurePlus clinic")
        
        # Save assessment data
        save_assessment_data(
            st.session_state.patient_info,
            st.session_state.answers,
            severity,
            stage_info,
            st.session_state.photo_analysis
        )
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Reset button
        if st.button("🔄 Start New Assessment"):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()

    # Sidebar with information
    with st.sidebar:
        st.header("ℹ️ About QurePlus")
        st.write("""
        QurePlus is an AI-powered healthcare platform specializing in varicose vein assessment and treatment.
        
        **Features:**
        - Quick 3-question assessment
        - AI-powered photo analysis
        - Personalized treatment recommendations
        - Expert medical consultations
        
        **Contact:**
        📞 +91 7093765543
        📧 contact@qureplus.com
        """)
        
        # Admin section
        if st.checkbox("🔐 Admin View"):
            password = st.text_input("Password", type="password")
            if password == "admin123":  # Simple password for demo
                st.success("✅ Admin access granted")
                
                # Display assessment data
                try:
                    df = pd.read_csv("assessments.csv")
                    st.subheader("📊 Assessment Data")
                    st.dataframe(df)
                    
                    # Download button
                    csv = df.to_csv(index=False)
                    st.download_button(
                        label="📥 Download CSV",
                        data=csv,
                        file_name=f"assessments_{datetime.now().strftime('%Y%m%d')}.csv",
                        mime="text/csv"
                    )
                except FileNotFoundError:
                    st.info("No assessment data available yet.")

if __name__ == "__main__":
    main()