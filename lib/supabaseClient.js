// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llfbnwucvjtyrammwgqt.supabase.co'; // Ganti dengan URL proyek Anda
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZmJud3Vjdmp0eXJhbW13Z3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5Njg3MDIsImV4cCI6MjA0ODU0NDcwMn0.E4jXY2UaG1dapQ1BCY1wu-79-9xLnDcPbdrM_q05BHk'; // Ganti dengan kunci anon Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey);