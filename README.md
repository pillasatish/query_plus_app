# QurePlus - AI Vein Health Assessment

A simple Streamlit application for AI-powered varicose vein health assessment.

## Features

- **Quick 3-Question Assessment**: Streamlined questionnaire focusing on key symptoms
- **AI Photo Analysis**: Optional photo upload with mock AI analysis
- **Personalized Results**: Severity-based recommendations and treatment plans
- **Data Export**: CSV export functionality for assessment data
- **Admin Dashboard**: Simple admin interface for viewing collected data

## Installation

1. Clone or download the project files
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
streamlit run app.py
```

The application will open in your browser at `http://localhost:8501`

## Deployment Options

### 1. Streamlit Cloud (Recommended)
- Push code to GitHub repository
- Connect to Streamlit Cloud
- Deploy with one click
- Free hosting with custom domain options

### 2. Heroku
```bash
# Create Procfile
echo "web: streamlit run app.py --server.port=$PORT --server.address=0.0.0.0" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### 3. Docker
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

### 4. Railway/Render
- Connect GitHub repository
- Set build command: `pip install -r requirements.txt`
- Set start command: `streamlit run app.py --server.address=0.0.0.0 --server.port=$PORT`

## Configuration

### Environment Variables (Optional)
- `OPENAI_API_KEY`: For real AI photo analysis
- `DATABASE_URL`: For PostgreSQL database connection
- `ADMIN_PASSWORD`: Custom admin password

### Adding Real AI Analysis
Replace the mock `analyze_photo_with_ai` function with actual AI service calls:

```python
import openai

def analyze_photo_with_ai(image, patient_info, symptoms):
    # Convert image to base64
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    # Call OpenAI Vision API
    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this image for varicose veins..."},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{img_str}"}
            ]
        }]
    )
    
    # Process and return results
    return parse_ai_response(response)
```

## File Structure

```
qureplus-streamlit/
├── app.py              # Main Streamlit application
├── requirements.txt    # Python dependencies
├── README.md          # This file
├── assessments.csv    # Generated assessment data
└── .streamlit/        # Streamlit configuration (optional)
    └── config.toml
```

## Admin Access

- Check "Admin View" in sidebar
- Default password: `admin123`
- View and download assessment data

## Customization

### Styling
Modify the CSS in the `st.markdown()` sections to change colors, fonts, and layout.

### Questions
Update the `VeinAssessment.questions` list to modify assessment questions.

### Severity Calculation
Adjust the `calculate_severity()` method to change how severity levels are determined.

### Treatment Recommendations
Modify the `get_stage_info()` method to update treatment recommendations.

## Data Storage

Currently uses CSV files for simplicity. For production, consider:
- PostgreSQL database
- SQLite for local storage
- Cloud databases (Supabase, Firebase)

## Security Notes

- Change default admin password
- Add proper authentication for production
- Implement data encryption for sensitive information
- Use environment variables for API keys

## Support

For questions or support:
- Email: contact@qureplus.com
- Phone: +91 7093765543