import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "savings") {
      systemPrompt = `Você é um consultor financeiro especialista em economia doméstica e finanças pessoais no Brasil. 
Você fornece dicas práticas, realistas e acionáveis para ajudar pessoas a economizar dinheiro no dia a dia.
Sempre responda em português do Brasil.`;

      userPrompt = context?.targetAmount
        ? `Preciso economizar R$ ${context.targetAmount} com uma meta diária de R$ ${context.dailyGoal}. 
Já economizei ${context.progress?.toFixed(0) || 0}% do total.
Me dê 5 dicas práticas e criativas para economizar dinheiro no dia a dia e atingir minha meta mais rápido.
Seja específico e inclua valores aproximados quando possível.`
        : `Me dê 5 dicas práticas e criativas para começar a economizar dinheiro no dia a dia.
Seja específico e inclua estratégias para diferentes faixas de renda.`;
    } else {
      systemPrompt = `Você é um consultor de investimentos experiente no mercado brasileiro.
Você fornece informações educacionais sobre investimentos, sempre alertando sobre riscos.
Sempre responda em português do Brasil.
IMPORTANTE: Suas sugestões são educacionais e não constituem recomendação de investimento.`;

      userPrompt = context?.targetAmount
        ? `Tenho como objetivo juntar R$ ${context.targetAmount}. Já tenho ${context.progress?.toFixed(0) || 0}% desse valor.
Me dê 5 sugestões de tipos de investimentos adequados para 2024/2025 no Brasil, considerando:
- Investimentos de baixo risco para iniciantes
- Opções com liquidez
- Diversificação
Inclua informações sobre rentabilidade esperada e riscos.`
        : `Me dê 5 sugestões de tipos de investimentos para quem está começando a investir no Brasil em 2024/2025.
Inclua opções de diferentes níveis de risco e explique brevemente cada uma.`;
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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_tips",
              description: "Return financial tips as an array of strings",
              parameters: {
                type: "object",
                properties: {
                  tips: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of 5 financial tips, each as a complete sentence",
                  },
                },
                required: ["tips"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_tips" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos à sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate tips");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid response format");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ tips: result.tips }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-finance-tips:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
