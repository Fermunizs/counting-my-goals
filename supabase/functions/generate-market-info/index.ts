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
    const { category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompts: Record<string, { system: string; user: string }> = {
      stocks: {
        system: `Você é um analista de mercado financeiro brasileiro especializado em ações. Forneça informações educacionais atualizadas sobre o mercado de ações brasileiro. Sempre responda em português do Brasil.`,
        user: `Forneça um resumo atual do mercado de ações brasileiro incluindo:
- Situação atual do Ibovespa (tendência geral, se está em alta ou baixa)
- 5 ações em destaque com potencial (ticker, nome da empresa, setor, e uma breve análise)
- Setores mais promissores no momento
- Dica geral para investidores

Formate cada ação como um objeto com: ticker, company, sector, analysis, trend (up/down/neutral).
IMPORTANTE: Estas são informações educacionais, não recomendações de investimento.`,
      },
      treasury: {
        system: `Você é um especialista em renda fixa e Tesouro Direto no Brasil. Forneça informações educacionais sobre os títulos disponíveis. Sempre responda em português do Brasil.`,
        user: `Forneça informações atualizadas sobre o Tesouro Direto incluindo:
- 5 principais títulos disponíveis com suas características
- Para cada título: nome, tipo (prefixado/IPCA+/Selic), rentabilidade aproximada, vencimento, e para quem é indicado
- Cenário atual da taxa Selic e perspectivas
- Dica para quem está começando

Formate cada título como um objeto com: name, type, yield, maturity, recommendation.
IMPORTANTE: Estas são informações educacionais, não recomendações de investimento.`,
      },
      fiis: {
        system: `Você é um especialista em Fundos de Investimento Imobiliário (FIIs) no Brasil. Forneça informações educacionais sobre FIIs. Sempre responda em português do Brasil.`,
        user: `Forneça informações atualizadas sobre FIIs incluindo:
- 5 FIIs em destaque com bom histórico
- Para cada FII: ticker, nome, segmento (logística, shopping, lajes corporativas, papel, etc.), dividend yield aproximado, e uma breve análise
- Panorama geral do mercado de FIIs
- Dica para investidores iniciantes

Formate cada FII como um objeto com: ticker, name, segment, dividendYield, analysis.
IMPORTANTE: Estas são informações educacionais, não recomendações de investimento.`,
      },
    };

    const prompt = prompts[category];
    if (!prompt) {
      throw new Error("Invalid category");
    }

    const toolsByCategory: Record<string, any> = {
      stocks: {
        type: "function",
        function: {
          name: "provide_market_data",
          description: "Return stock market data",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Brief market summary" },
              indexTrend: { type: "string", enum: ["up", "down", "neutral"] },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ticker: { type: "string" },
                    company: { type: "string" },
                    sector: { type: "string" },
                    analysis: { type: "string" },
                    trend: { type: "string", enum: ["up", "down", "neutral"] },
                  },
                  required: ["ticker", "company", "sector", "analysis", "trend"],
                  additionalProperties: false,
                },
              },
              tip: { type: "string" },
            },
            required: ["summary", "indexTrend", "items", "tip"],
            additionalProperties: false,
          },
        },
      },
      treasury: {
        type: "function",
        function: {
          name: "provide_market_data",
          description: "Return treasury bond data",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Brief treasury market summary" },
              selicRate: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string" },
                    yield: { type: "string" },
                    maturity: { type: "string" },
                    recommendation: { type: "string" },
                  },
                  required: ["name", "type", "yield", "maturity", "recommendation"],
                  additionalProperties: false,
                },
              },
              tip: { type: "string" },
            },
            required: ["summary", "selicRate", "items", "tip"],
            additionalProperties: false,
          },
        },
      },
      fiis: {
        type: "function",
        function: {
          name: "provide_market_data",
          description: "Return FII data",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Brief FII market summary" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ticker: { type: "string" },
                    name: { type: "string" },
                    segment: { type: "string" },
                    dividendYield: { type: "string" },
                    analysis: { type: "string" },
                  },
                  required: ["ticker", "name", "segment", "dividendYield", "analysis"],
                  additionalProperties: false,
                },
              },
              tip: { type: "string" },
            },
            required: ["summary", "items", "tip"],
            additionalProperties: false,
          },
        },
      },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        tools: [toolsByCategory[category]],
        tool_choice: { type: "function", function: { name: "provide_market_data" } },
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
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate market info");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid response format");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-market-info:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
