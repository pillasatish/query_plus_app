import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const { imageUrl } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analyze this image for signs of varicose veins and related conditions. Look for: varicose veins, spider veins, skin discoloration, swelling, and ulcers. Provide a detailed analysis with confidence scores for each condition." 
            },
            {
              type: "image_url",
              image_url: imageUrl,
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    const analysis = response.choices[0].message.content;
    
    // Parse the analysis to extract structured data
    const findings = {
      varicoseVeins: analysis.toLowerCase().includes('varicose vein'),
      spiderVeins: analysis.toLowerCase().includes('spider vein'),
      skinDiscoloration: analysis.toLowerCase().includes('discolor'),
      ulcers: analysis.toLowerCase().includes('ulcer'),
      swelling: analysis.toLowerCase().includes('swell'),
    };

    // Calculate overall severity (0-4)
    const severity = Object.values(findings).filter(Boolean).length;

    const result = {
      confidence: 0.85, // Base confidence score
      findings,
      severity,
      recommendations: [
        "Schedule a consultation with a vein specialist",
        "Consider compression therapy",
        "Monitor for changes in symptoms"
      ],
      rawAnalysis: analysis
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze image' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});