import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // Mengambil data dari tabel 'sensor'
  const { data, error } = await supabase.from('sensor').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Mengembalikan data yang diambil
  res.status(200).json(data);
}
