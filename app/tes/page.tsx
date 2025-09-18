"use client";
import { useEffect, useState } from 'react';

// Mendefinisikan interface untuk data sensor
interface Sensor {
  id: number;
  created_at: string;
  kekeruhan: number;
  phmeter: number;
  waterflow: number;
  temp: number;
}

export default function Home() {
  const [sensors, setSensors] = useState<Sensor[]>([]); // Menggunakan tipe Sensor[] untuk state sensors

  useEffect(() => {
    // Mengambil data dari API 'sensors'
    const fetchData = async () => {
      const response = await fetch('./sensors');
      const data: Sensor[] = await response.json(); // Tentukan tipe data sebagai Sensor[]
      setSensors(data); // Menyimpan data ke state sensors
    };

    fetchData(); // Memanggil fungsi fetchData untuk mengambil data
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sensor Data</h1>
      
      {/* Tabel untuk menampilkan data */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Kekeruhan</th>
            <th className="px-4 py-2 text-left">PH Meter</th>
            <th className="px-4 py-2 text-left">Water Flow</th>
            <th className="px-4 py-2 text-left">Temp</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map(sensor => (
            <tr key={sensor.id} className="border-b">
              <td className="px-4 py-2">{sensor.id}</td>
              <td className="px-4 py-2">{new Date(sensor.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">{sensor.kekeruhan}</td>
              <td className="px-4 py-2">{sensor.phmeter}</td>
              <td className="px-4 py-2">{sensor.waterflow}</td>
              <td className="px-4 py-2">{sensor.temp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
