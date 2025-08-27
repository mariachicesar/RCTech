// @ts-expect-error - Deno imports are not recognized by Next.js TypeScript
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  console.log("=== FUNCTION STARTED ===");
  console.log("Method:", req.method);
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    console.log("Returning OPTIONS response");
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  console.log("Processing POST request");

  try {
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const { url, method = "POST", payload, googleAuth } = body ?? {};
    console.log("URL:", url);
    console.log("Method:", method);
    console.log("Has googleAuth:", !!googleAuth);
    console.log("Has payload:", !!payload);
    
    // Validate required fields
    if (!url || typeof url !== "string") {
      console.log("Missing URL");
      return new Response(JSON.stringify({ error: "Missing 'url' string" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!googleAuth || !googleAuth.toLowerCase().startsWith("bearer ")) {
      console.log("Missing or invalid googleAuth");
      return new Response(JSON.stringify({ error: "Missing googleAuth in request body" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate URL
    let target: URL;
    try {
      target = new URL(url);
    } catch (e) {
      console.log("Invalid URL:", e);
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Updated allowlist for Google Business Profile APIs
    const allowedHosts = new Set([
      "mybusiness.googleapis.com", // Current Google Business Profile API
      "businessprofileperformance.googleapis.com", // Performance data
      "places.googleapis.com", // Places API
    ]);
    
    if (!allowedHosts.has(target.host)) {
      console.log("Host not allowed:", target.host);
      return new Response(JSON.stringify({ error: "Host not allowed" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Making request to Google API:", url);
    console.log("Method:", method);
    console.log("Auth header length:", googleAuth.length);

    // Make the request to Google API
    const googleRes = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": googleAuth,
      },
      body: ["GET", "HEAD", "DELETE"].includes(method.toUpperCase()) ? undefined : JSON.stringify(payload ?? {}),
    });

    console.log("Google API response status:", googleRes.status);
    
    const text = await googleRes.text();
    console.log("Google API response length:", text.length);
    console.log("Response preview:", text.substring(0, 200));

    return new Response(text, {
      status: googleRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: "Function error", 
      details: String(error) 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});