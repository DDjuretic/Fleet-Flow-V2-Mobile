import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("🚀 create-company-for-user function initialized");

Deno.serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Received request: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log("Supabase admin client created.");

    // 1. Get the user from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Error: Missing authorization header");
      throw new Error('Missing authorization header');
    }
    console.log("Authorization header found.");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error("Error getting user from token:", userError);
      throw new Error(`User not found or invalid token: ${userError?.message}`);
    }
    console.log(`Authenticated user: ${user.email} (${user.user_id})`);

    // 2. Get the company name from the request body
    const { companyName } = await req.json();
    if (!companyName) {
      console.error("Error: Company name is required in body");
      throw new Error('Company name is required');
    }
    console.log(`Received company name: ${companyName}`);

    // 3. Create the company
    console.log(`Creating company '${companyName}' for owner ${user.user_id}`);
    const { data: newCompany, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({ name: companyName, owner_id: user.user_id })
      .select('company_id')
      .single();

    if (companyError || !newCompany) {
      console.error("Error creating company:", companyError);
      throw new Error(`Failed to create company: ${companyError?.message}`);
    }
    console.log(`Company created with ID: ${newCompany.company_id}`);

    // 4. Link the user to the company in public.users
    console.log(`Linking user ${user.user_id} to company ${newCompany.company_id}`);
    const { error: userUpdateError } = await supabaseAdmin
      .from('users')
      .update({ company_id: newCompany.company_id }) // Removed onboarding_status update
      .eq('user_id', user.user_id);
      
    if (userUpdateError) {
        console.error("Error linking user to company:", userUpdateError);
        throw new Error(`Failed to link user to company: ${userUpdateError.message}`);
    }
    console.log("User successfully linked to company.");

    // 5. Assign 'admin' role to the user
    console.log("Fetching 'admin' role ID...");
    const { data: adminRole, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('role_id')
        .eq('role_name', 'admin')
        .single();

    if (roleError || !adminRole) {
        console.error("Error fetching 'admin' role:", roleError);
        throw new Error("Could not find 'admin' role.");
    }
    console.log(`'admin' role ID is: ${adminRole.role_id}`);

    console.log(`Assigning admin role to user ${user.user_id}`);
    const { error: userRoleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: user.user_id, role_id: adminRole.role_id, company_id: newCompany.company_id });

    if (userRoleError) {
        console.error("Error assigning admin role:", userRoleError);
        throw new Error(`Failed to assign admin role: ${userRoleError.message}`);
    }
    console.log("Admin role assigned successfully.");


    return new Response(JSON.stringify({ message: 'Company created and user assigned successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("!!! Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 