import { createClient } from '@/utils/supabase/server';

export default async function sensor() {
  const supabase = await createClient();
//   const { data: countries } = await supabase.from("countries").select();

  let { data: sensor, error } = await supabase
  .from('sensor')
  .select('*')
          
  return <pre>{JSON.stringify(sensor, null, 2)}</pre>
}