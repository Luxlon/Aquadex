// pages/SensorTable.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface SensorData {
  id: number;
  created_at: string;
  kekeruhan: number;
  phmeter: number;
  waterflow: number;
  temp: number;
}


const SensorTable = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sensors, error } = await supabase
        .from('sensor')
        .select('id, created_at, kekeruhan, phmeter, waterflow, temp');

      if (error) {
        console.error(error);
      } else {
        setData(sensors);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data Sensor</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Kekeruhan</th>
            <th>Waterflow</th>
            <th>Temperature</th>
          </tr>
        </thead>
        <tbody>
          {data.map(sensor => (
            <tr key={sensor.id}>
              <td>{sensor.id}</td>
              <td>{new Date(sensor.created_at).toLocaleString()}</td>
              <td>{sensor.kekeruhan}</td>
              <td>{sensor.waterflow}</td>
              <td>{sensor.temp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorTable;