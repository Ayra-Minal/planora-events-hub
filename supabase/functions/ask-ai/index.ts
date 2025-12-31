import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client to fetch events
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all events from database
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(`
        *,
        category:categories(name, slug)
      `)
      .order("date", { ascending: true });

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      throw new Error("Failed to fetch events");
    }

    // Format events for the AI
    const eventsContext = events?.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.short_description || e.description.slice(0, 200),
      date: e.date,
      time: e.time,
      location: e.location,
      category: e.category?.name || "Uncategorized",
      price: e.price,
    })) || [];

    const systemPrompt = `You are Planora AI, a helpful assistant for an event discovery platform in Kochi, Kerala, India.

Your job is to help users find events from our database. You can ONLY recommend events that exist in our database.

Here are all the available events in our database:
${JSON.stringify(eventsContext, null, 2)}

Instructions:
1. When users ask about events, search through the available events and recommend relevant ones.
2. If the user's query matches any events, provide helpful descriptions and encourage them to check out the event.
3. If no events match the user's query, politely let them know and suggest browsing our categories or checking back later.
4. Always be friendly and helpful.
5. When recommending events, include the event ID in your response using this exact format: [EVENT_ID:uuid] so we can display event cards.
6. You can recommend multiple events if relevant.
7. Consider date, category, location, and keywords when matching events.
8. For questions about the current date/time, today is ${new Date().toISOString().split('T')[0]}.

Example response format when events are found:
"Great question! I found some events that might interest you:

**Kochi Tech Meetup 2025** - A networking event for tech enthusiasts at Infopark. [EVENT_ID:abc123]

**Startup Kerala Summit** - Perfect for entrepreneurs looking to connect! [EVENT_ID:def456]"

Remember: You can ONLY recommend events from the database above. Do not make up or suggest events that don't exist.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
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
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("ask-ai error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});