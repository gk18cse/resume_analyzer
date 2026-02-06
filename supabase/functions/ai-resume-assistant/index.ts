import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  suggestions: `You are a professional resume expert and ATS optimization specialist. Analyze the given resume content and provide specific, actionable improvement suggestions. Focus on:
- Missing sections that would strengthen the resume
- Weak bullet points that need stronger action verbs
- Missing quantifiable achievements
- Keyword gaps for ATS optimization
- Grammar and clarity improvements
- Professional tone enhancements

Return your response as a JSON object with this structure:
{
  "suggestions": [
    { "type": "improvement" | "missing" | "grammar" | "keyword", "section": "string", "current": "string or null", "suggested": "string", "priority": "high" | "medium" | "low", "reason": "string" }
  ],
  "overallFeedback": "string",
  "missingSections": ["string"],
  "strengthScore": number (0-100)
}`,

  bullet_points: `You are a professional resume writer specializing in ATS-optimized bullet points. Generate 3-5 strong, quantifiable bullet points for the given role and context. Each bullet should:
- Start with a powerful action verb
- Include specific metrics/numbers where possible
- Be concise (under 20 words)
- Be ATS-friendly with relevant keywords

Return as JSON: { "bullets": ["string"] }`,

  summary: `You are a professional resume writer. Generate a compelling professional summary (2-3 sentences, 30-60 words) for the given person based on their experience and target role. The summary should:
- Highlight years of experience and key expertise
- Include industry-specific keywords
- Be ATS-optimized
- Sound professional but not generic

Return as JSON: { "summary": "string" }`,

  job_match: `You are an ATS (Applicant Tracking System) specialist. Compare the resume content against the provided job description and provide a detailed analysis. Return as JSON:
{
  "matchScore": number (0-100),
  "matchedKeywords": [{ "keyword": "string", "found": boolean, "importance": "critical" | "important" | "nice-to-have" }],
  "missingKeywords": ["string"],
  "formattingFeedback": ["string"],
  "optimizationTips": ["string"],
  "grammarIssues": [{ "text": "string", "suggestion": "string" }],
  "sectionFeedback": { "summary": "string", "experience": "string", "skills": "string", "education": "string" }
}`,

  smart_questions: `You are an AI career coach helping build a professional resume. Based on the current resume state, ask 2-3 smart follow-up questions to gather information that would significantly improve the resume. Questions should be specific and actionable.

Return as JSON: { "questions": [{ "question": "string", "section": "string", "context": "string" }] }`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, resumeData, jobDescription, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = SYSTEM_PROMPTS[action];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: `Unknown action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userMessage = "";
    switch (action) {
      case "suggestions":
        userMessage = `Analyze this resume and provide improvement suggestions:\n\n${JSON.stringify(resumeData, null, 2)}`;
        break;
      case "bullet_points":
        userMessage = `Generate professional bullet points for this role:\nPosition: ${context?.position || "Not specified"}\nCompany: ${context?.company || "Not specified"}\nIndustry: ${context?.industry || "General"}\nExisting description: ${context?.description || "None"}`;
        break;
      case "summary":
        userMessage = `Generate a professional summary for:\nName: ${resumeData?.personalInfo?.fullName || "Professional"}\nTarget Role: ${context?.targetRole || "Not specified"}\nExperience: ${JSON.stringify(resumeData?.experience?.slice(0, 3) || [])}\nSkills: ${resumeData?.skills?.map((s: any) => s.name).join(", ") || "Not specified"}`;
        break;
      case "job_match":
        userMessage = `Compare this resume against the job description:\n\nRESUME:\n${JSON.stringify(resumeData, null, 2)}\n\nJOB DESCRIPTION:\n${jobDescription}`;
        break;
      case "smart_questions":
        userMessage = `Based on this resume state, what questions should I ask to improve it?\n\n${JSON.stringify(resumeData, null, 2)}`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse as JSON, handling markdown code blocks
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = { rawContent: content };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-resume-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
