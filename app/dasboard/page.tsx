"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { Activity, Droplets, Thermometer, Waves, TrendingUp, AlertTriangle } from "lucide-react";

import CircularProgress from "./CircularProgress";
import Tableui from "./tableui";

interface SensorData {
  turbidity: number;
  phmeter: number;
  temp: number;
  waterflow: number;
}

interface WaterQualityStatus {
  overall: 'excellent' | 'good' | 'warning' | 'danger';
  message: string;
}

export default function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    turbidity: 0,
    phmeter: 0,
    temp: 0,
    waterflow: 0,
  });

  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/sensors.json");
        const sensors = await res.json();
        if (Array.isArray(sensors) && sensors.length > 0) {
          const latest = sensors[0];
          setSensorData({
            turbidity: latest.kekeruhan ?? 0,
            phmeter: latest.phmeter ?? 0,
            temp: latest.temp ?? 0,
            waterflow: latest.waterflow ?? 0,
          });
          setLastUpdate(new Date(latest.created_at).toLocaleString('id-ID'));
        }
      } catch (err) {
        console.error("Error loading sensors data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Sensor limits and status calculation
  const turbidityMax = 4000;
  const phMax = 14;
  const tempMax = 40;
  const waterFlowMax = 10;

  const getTurbidityStatus = (value: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (value <= 100) return 'excellent';
    if (value <= 500) return 'good';
    if (value <= 1500) return 'warning';
    return 'danger';
  };

  const getPHStatus = (value: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (value >= 6.5 && value <= 8.5) return 'excellent';
    if (value >= 6.0 && value <= 9.0) return 'good';
    if (value >= 5.5 && value <= 9.5) return 'warning';
    return 'danger';
  };

  const getTempStatus = (value: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (value >= 20 && value <= 30) return 'excellent';
    if (value >= 15 && value <= 35) return 'good';
    if (value >= 10 && value <= 38) return 'warning';
    return 'danger';
  };

  const getWaterFlowStatus = (value: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (value >= 2.0 && value <= 5.0) return 'excellent';
    if (value >= 1.5 && value <= 6.0) return 'good';
    if (value >= 1.0 && value <= 7.0) return 'warning';
    return 'danger';
  };

  const getOverallStatus = (): WaterQualityStatus => {
    const statuses = [
      getTurbidityStatus(sensorData.turbidity),
      getPHStatus(sensorData.phmeter),
      getTempStatus(sensorData.temp),
      getWaterFlowStatus(sensorData.waterflow)
    ];

    if (statuses.includes('danger')) {
      return { overall: 'danger', message: 'Kualitas air dalam kondisi berbahaya!' };
    }
    if (statuses.includes('warning')) {
      return { overall: 'warning', message: 'Kualitas air perlu perhatian.' };
    }
    if (statuses.filter(s => s === 'excellent').length >= 3) {
      return { overall: 'excellent', message: 'Kualitas air sangat baik!' };
    }
    return { overall: 'good', message: 'Kualitas air dalam kondisi baik.' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Dashboard Aquadex
            </h2>
            <p className="text-slate-400">
              Real-time monitoring sistem kualitas air • Terakhir diperbarui: {lastUpdate}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              overallStatus.overall === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' :
              overallStatus.overall === 'good' ? 'bg-blue-500/20 text-blue-400' :
              overallStatus.overall === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {overallStatus.overall === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              <span className="font-medium text-[10px] sm:text-[14px] lg:text-[16px]">{overallStatus.message}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Turbidity Meter */}
        <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Droplets className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Turbidity</h3>
                <p className="text-sm text-slate-400">Kekeruhan Air</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <CircularProgress 
              value={sensorData.turbidity} 
              max={turbidityMax}
              label="Turbidity"
              unit="NTU"
              status={getTurbidityStatus(sensorData.turbidity)}
            />
          </CardBody>
        </Card>

        {/* pH Meter */}
        <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">pH Level</h3>
                <p className="text-sm text-slate-400">Tingkat Keasaman</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <CircularProgress 
              value={sensorData.phmeter} 
              max={phMax}
              label="pH"
              unit="pH"
              status={getPHStatus(sensorData.phmeter)}
            />
          </CardBody>
        </Card>

        {/* Temperature Meter */}
        <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Thermometer className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Temperature</h3>
                <p className="text-sm text-slate-400">Suhu Air</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <CircularProgress 
              value={sensorData.temp} 
              max={tempMax}
              label="Temperature"
              unit="°C"
              status={getTempStatus(sensorData.temp)}
            />
          </CardBody>
        </Card>

        {/* Water Flow Meter */}
        <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Waves className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Water Flow</h3>
                <p className="text-sm text-slate-400">Aliran Air</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <CircularProgress 
              value={sensorData.waterflow} 
              max={waterFlowMax}
              label="Flow Rate"
              unit="L/s"
              status={getWaterFlowStatus(sensorData.waterflow)}
            />
          </CardBody>
        </Card>
      </div>

      {/* Historical Data Table */}
      <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Historical Data</h3>
              <p className="text-sm text-slate-400">Riwayat data sensor kualitas air</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Tableui />
        </CardBody>
      </Card>
    </div>
  );
}