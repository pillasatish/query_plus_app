import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime
import base64

# Configure page
st.set_page_config(
    page_title="QurePlus - AI Vein Assessment",
    page_icon="💜",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 2rem 0;
        background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
        color: white;
        margin: -1rem -1rem 2rem -1rem;
        border-radius: 0 0 20px 20px;
    }
    .assessment-card {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
    }
    .severity-high {
        background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
        border-left: 5px solid #EF4444;
    }
    .severity-medium {
        background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
        border-left: 5px solid #F59E0B;
    }
    .severity-low {
        background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
        border-left: 5px solid #10B981;
    }
    .stButton > button {
        background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 0.5rem 2rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'step' not in st.session_state:
    st.session_state.step = 'info'
if 'patient_data' not in st.session_state:
    st.session_state.patient_data = {}
if 'assessment_data' not in st.session_state:
    st.session_state.assessment_data = {}

# Data file path
DATA_FILE = 'assessments.csv'

def save_assessment(data):
    """Save assessment data to CSV file"""
    df = pd.DataFrame([data])
    if os.path.exists(DATA_FILE):
        existing_df = pd.read_csv(DATA_FILE)
        df = pd.concat([existing_df, df], ignore_index=True)
    df.to_csv(DATA_FILE, index=False)

def load_assessments():
    """Load assessments from CSV file"""
    if os.path.exists(DATA_FILE):
        return pd.read_csv(DATA_FILE)
    return pd.DataFrame()

def calculate_severity(answers):
    """Calculate severity based on answers"""
    score = 0
    if answers.get('visible_veins') == 'Yes':
        score += 1
    if answers.get('ulcers') == 'Yes':
        score += 3
    if answers.get('previous_treatment') == 'Yes':
        score += 1
    
    if score >= 3:
        return 'High', 4
    elif score >= 1:
        return 'Medium', 2
    else:
        return 'Low', 1

def mock_ai_analysis(image):
    """Mock AI analysis of uploaded image"""
    return {
        'confidence': 0.85,
        'findings': {
            'varicose_veins': True,
            'spider_veins': False,
            'skin_discoloration': False,
            'ulcers': False,
            'swelling': True
        },
        'severity_adjustment': 1
    }

def get_recommendations(severity, level):
    """Get treatment recommendations based on severity"""
    if severity == 'High':
        return {
            'title': 'High Priority - Immediate Medical Attention Required',
            'description': 'Your symptoms indicate advanced varicose veins that require prompt medical intervention.',
            'treatments': [
                'Endovenous Laser Treatment (EVLT)',
                'VenaSeal Closure System',
                'Radiofrequency Ablation (RFA)',
                'Surgical intervention if necessary'
            ],
            'next_steps': [
                'Schedule consultation within 1-2 weeks',
                'Get Doppler ultrasound examination',
                'Consider compression therapy immediately'
            ]
        }
    elif severity == 'Medium':
        return {
            'title': 'Moderate Symptoms - Treatment Recommended',
            'description': 'Your symptoms suggest varicose veins that would benefit from treatment.',
            'treatments': [
                'Sclerotherapy',
                'Ambulatory Phlebectomy',
                'Compression therapy',
                'Lifestyle modifications'
            ],
            'next_steps': [
                'Schedule consultation within 4-6 weeks',
                'Start wearing compression stockings',
                'Implement lifestyle changes'
            ]
        }
    else:
        return {
            'title': 'Low Risk - Preventive Care',
            'description': 'Your symptoms are minimal. Focus on prevention and monitoring.',
            'treatments': [
                'Compression stockings',
                'Regular exercise',
                'Leg elevation',
                'Weight management'
            ],
            'next_steps': [
                'Monitor symptoms regularly',
                'Maintain healthy lifestyle',
                'Consider consultation if symptoms worsen'
            ]
        }

# Main app logic
def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>💜 QurePlus</h1>
        <h3>AI-Powered Vein Health Assessment</h3>
        <p>Get instant, accurate assessments for your vein health</p>
    </div>
    """, unsafe_allow_html=True)

    # Sidebar for admin
    with st.sidebar:
        st.title("Admin Panel")
        if st.button("View Assessment Data"):
            st.session_state.step = 'admin'
        if st.button("Back to Assessment"):
            st.session_state.step = 'info'

    # Main content based on step
    if st.session_state.step == 'admin':
        show_admin_panel()
    elif st.session_state.step == 'info':
        show_patient_info()
    elif st.session_state.step == 'assessment':
        show_assessment()
    elif st.session_state.step == 'results':
        show_results()

def show_patient_info():
    st.markdown('<div class="assessment-card">', unsafe_allow_html=True)
    st.header("Patient Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        name = st.text_input("Full Name *", key="name")
        age = st.number_input("Age *", min_value=1, max_value=120, key="age")
    
    with col2:
        city = st.text_input("City *", key="city")
        phone = st.text_input("Phone Number", key="phone")
    
    if st.button("Start Assessment", type="primary"):
        if name and age and city:
            st.session_state.patient_data = {
                'name': name,
                'age': age,
                'city': city,
                'phone': phone,
                'timestamp': datetime.now().isoformat()
            }
            st.session_state.step = 'assessment'
            st.rerun()
        else:
            st.error("Please fill in all required fields marked with *")
    
    st.markdown('</div>', unsafe_allow_html=True)

def show_assessment():
    st.markdown('<div class="assessment-card">', unsafe_allow_html=True)
    st.header(f"Assessment for {st.session_state.patient_data['name']}")
    
    st.subheader("Please answer the following questions:")
    
    # Question 1
    st.write("**1. Do you see any veins visible on your legs?**")
    visible_veins = st.radio("", ["Yes", "No"], key="visible_veins")
    
    # Question 2
    st.write("**2. Do you have open sores, ulcers, or non-healing wounds on your legs?**")
    ulcers = st.radio("", ["Yes", "No"], key="ulcers")
    
    # Question 3
    st.write("**3. Have you done any treatment for varicose veins previously?**")
    previous_treatment = st.radio("", ["Yes", "No"], key="previous_treatment")
    
    # Optional image upload
    st.write("**Optional: Upload a photo of your legs for AI analysis**")
    uploaded_image = st.file_uploader("Choose an image...", type=['png', 'jpg', 'jpeg'])
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("Back", type="secondary"):
            st.session_state.step = 'info'
            st.rerun()
    
    with col2:
        if st.button("Get Results", type="primary"):
            st.session_state.assessment_data = {
                'visible_veins': visible_veins,
                'ulcers': ulcers,
                'previous_treatment': previous_treatment,
                'has_image': uploaded_image is not None
            }
            
            if uploaded_image:
                # Mock AI analysis
                ai_result = mock_ai_analysis(uploaded_image)
                st.session_state.assessment_data['ai_analysis'] = ai_result
            
            st.session_state.step = 'results'
            st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)

def show_results():
    # Calculate severity
    severity, level = calculate_severity(st.session_state.assessment_data)
    
    # Adjust severity based on AI analysis if available
    if 'ai_analysis' in st.session_state.assessment_data:
        ai_data = st.session_state.assessment_data['ai_analysis']
        if ai_data['findings']['ulcers']:
            severity, level = 'High', 4
        elif ai_data['findings']['varicose_veins']:
            level = min(level + ai_data['severity_adjustment'], 4)
            if level >= 3:
                severity = 'High'
    
    recommendations = get_recommendations(severity, level)
    
    # Save assessment
    assessment_record = {
        **st.session_state.patient_data,
        **st.session_state.assessment_data,
        'severity': severity,
        'severity_level': level,
        'recommendations': json.dumps(recommendations)
    }
    save_assessment(assessment_record)
    
    # Display results
    severity_class = f"severity-{severity.lower()}"
    
    st.markdown(f'<div class="assessment-card {severity_class}">', unsafe_allow_html=True)
    
    st.header("🎯 Assessment Results")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Severity Level", f"Level {level}")
    with col2:
        st.metric("Risk Category", severity)
    with col3:
        if 'ai_analysis' in st.session_state.assessment_data:
            confidence = st.session_state.assessment_data['ai_analysis']['confidence']
            st.metric("AI Confidence", f"{confidence:.0%}")
    
    st.subheader(recommendations['title'])
    st.write(recommendations['description'])
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Recommended Treatments:")
        for treatment in recommendations['treatments']:
            st.write(f"• {treatment}")
    
    with col2:
        st.subheader("Next Steps:")
        for step in recommendations['next_steps']:
            st.write(f"• {step}")
    
    # AI Analysis Results
    if 'ai_analysis' in st.session_state.assessment_data:
        st.subheader("AI Image Analysis Results:")
        ai_data = st.session_state.assessment_data['ai_analysis']
        findings = ai_data['findings']
        
        col1, col2 = st.columns(2)
        with col1:
            st.write("**Detected Conditions:**")
            for condition, detected in findings.items():
                status = "✅ Detected" if detected else "❌ Not detected"
                st.write(f"• {condition.replace('_', ' ').title()}: {status}")
        
        with col2:
            st.write(f"**Analysis Confidence:** {ai_data['confidence']:.0%}")
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Action buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("📞 Book Consultation"):
            st.success("Redirecting to consultation booking...")
    
    with col2:
        if st.button("📧 Email Results"):
            st.success("Results will be emailed to you!")
    
    with col3:
        if st.button("🔄 New Assessment"):
            # Reset session state
            for key in ['step', 'patient_data', 'assessment_data']:
                if key in st.session_state:
                    del st.session_state[key]
            st.rerun()

def show_admin_panel():
    st.header("📊 Assessment Data Dashboard")
    
    df = load_assessments()
    
    if df.empty:
        st.info("No assessment data available yet.")
        return
    
    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Assessments", len(df))
    
    with col2:
        high_severity = len(df[df['severity'] == 'High'])
        st.metric("High Severity Cases", high_severity)
    
    with col3:
        avg_age = df['age'].mean() if 'age' in df.columns else 0
        st.metric("Average Age", f"{avg_age:.1f}")
    
    with col4:
        with_images = len(df[df['has_image'] == True]) if 'has_image' in df.columns else 0
        st.metric("With Images", with_images)
    
    # Data table
    st.subheader("Assessment Records")
    
    # Display columns
    display_columns = ['name', 'age', 'city', 'severity', 'visible_veins', 'ulcers', 'previous_treatment', 'timestamp']
    available_columns = [col for col in display_columns if col in df.columns]
    
    if available_columns:
        st.dataframe(df[available_columns], use_container_width=True)
    
    # Download button
    if not df.empty:
        csv = df.to_csv(index=False)
        b64 = base64.b64encode(csv.encode()).decode()
        href = f'<a href="data:file/csv;base64,{b64}" download="assessments.csv">📥 Download CSV</a>'
        st.markdown(href, unsafe_allow_html=True)

if __name__ == "__main__":
    main()