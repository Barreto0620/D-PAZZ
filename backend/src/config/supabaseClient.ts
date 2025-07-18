import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Use a chave 'service_role' para o backend

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Service Role Key must be defined in the .env file for the backend");
}

export const supabase = createClient(supabaseUrl, supabaseKey);