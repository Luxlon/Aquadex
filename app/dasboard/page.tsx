"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import CircularProgress from "./CircularProgress";
import { supabase } from "../../lib/supabaseClient"; // Pastikan jalur benar
import Tableui from "./tableui";

interface SensorData {
  turbidity: number;
  phmeter: number;
  temp: number;
  waterflow: number;
}

export default function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    turbidity: 0,
    phmeter: 0,
    temp: 0,
    waterflow: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("sensor")
        .select("kekeruhan, phmeter, temp, waterflow")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching data:", error);
      } else if (data && data.length > 0) {
        setSensorData({
          turbidity: data[0].kekeruhan,
          phmeter: data[0].phmeter,
          temp: data[0].temp,
          waterflow: data[0].waterflow,
        });
      }
    };

    fetchData();

    // Optional: Realtime listener (Supabase subscription)
    const subscription = supabase
      .channel("sensor-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sensor" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const turbidityMax = 4000;
  const phMax = 14;
  const tempMax = 40;
  const waterFlowMax = 10;

  return (
    <div>
    <div className="flex items-center justify-start gap-6 p-4">
      {/* Turbidity Meter */}
      <Card className="w-[300px] h-[300px] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
        <CardBody className="justify-center items-center">
          <CircularProgress value={sensorData.turbidity} max={turbidityMax} />
        </CardBody>
        <CardFooter className="justify-center items-center pt-0">
          <Chip
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
          >
            Turbidity Meter
          </Chip>
        </CardFooter>
      </Card>

      {/* PH Meter */}
      <Card className="w-[300px] h-[300px] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
        <CardBody className="justify-center items-center">
          <CircularProgress value={sensorData.phmeter} max={phMax} />
        </CardBody>
        <CardFooter className="justify-center items-center pt-0">
          <Chip
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
          >
            PH Meter
          </Chip>
        </CardFooter>
      </Card>

      {/* Temperature Meter */}
      <Card className="w-[300px] h-[300px] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
        <CardBody className="justify-center items-center">
          <CircularProgress value={sensorData.temp} max={tempMax} />
        </CardBody>
        <CardFooter className="justify-center items-center pt-0">
          <Chip
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
          >
            Temperature Meter
          </Chip>
        </CardFooter>
      </Card>

      {/* Water Flow Meter */}
      <Card className="w-[300px] h-[300px] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
        <CardBody className="justify-center items-center">
          <CircularProgress value={sensorData.waterflow} max={waterFlowMax} />
        </CardBody>
        <CardFooter className="justify-center items-center pt-0">
          <Chip
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
          >
            Water Flow Meter
          </Chip>
        </CardFooter>
      </Card>
    </div>


    <div>
      <Tableui />
      
    </div>
    </div>
  )
}
