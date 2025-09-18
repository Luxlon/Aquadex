import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";

interface SensorData {
  id: number;
  created_at: string;
  turbidity: number;
  phmeter: number;
  waterflow: number;
  temp: number;
}

const columns = [
  { key: "created_at", label: "CREATED" },
  { key: "turbidity", label: "TURBIDITY" },
  { key: "phmeter", label: "PH METER" },
  { key: "temp", label: "TEMP" },
  { key: "waterflow", label: "WATERFLOW" },
];

export default function TableUI() {
  const [rows, setRows] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sensors, error } = await supabase
        .from('sensor')
        .select('id, created_at, kekeruhan, phmeter, waterflow, temp');

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // Transform data to match SensorData interface
        const transformedData = sensors?.map(sensor => ({
          id: sensor.id,
          created_at: sensor.created_at,
          turbidity: sensor.kekeruhan, // Rename here
          phmeter: sensor.phmeter,
          waterflow: sensor.waterflow,
          temp: sensor.temp,
        })) || [];
        
        setRows(transformedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table aria-label="Sensor Data Table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
