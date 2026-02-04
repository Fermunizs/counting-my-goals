/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goalName, goalEmoji, goalTarget, goalCurrent } = await req.json();

    if (!goalName) {
      throw new Error("Goal name is required");
    }

    const progress = goalTarget > 0 ? ((goalCurrent / goalTarget) * 100).toFixed(0) : 0;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Você é um coach de produtividade e desenvolvimento pessoal. Forneça 3 dicas práticas, concisas e motivacionais em português brasileiro para ajudar a pessoa a atingir sua meta mais rapidamente. 
            
Formato das dicas:
- Cada dica deve ter no máximo 2 frases
- Seja específico e prático
- Use linguagem motivacional
- Adapte as dicas ao contexto da meta

Responda APENAS com as 3 dicas, separadas por |||, sem numeração ou formatação extra.`,
          },
          {
            role: "user",
            content: `Meta: ${goalEmoji} ${goalName}
Objetivo: ${goalTarget}
Progresso atual: ${goalCurrent} (${progress}%)

Gere 3 dicas práticas para atingir essa meta mais rápido.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const tipsText = data.choices?.[0]?.message?.content || "";
    const tips = tipsText.split("|||").map((tip: string) => tip.trim()).filter((tip: string) => tip.length > 0);

    return new Response(JSON.stringify({ tips }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error generating tips:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
