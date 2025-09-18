import { useEffect, useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  DatePicker
} from "@nextui-org/react";
import { Search, Filter, Calendar } from "lucide-react";

interface SensorData {
  id: number;
  created_at: string;
  turbidity: number;
  phmeter: number;
  waterflow: number;
  temp: number;
}

const columns = [
  { key: "created_at", label: "WAKTU" },
  { key: "turbidity", label: "KEKERUHAN (NTU)" },
  { key: "phmeter", label: "PH LEVEL" },
  { key: "temp", label: "SUHU (°C)" },
  { key: "waterflow", label: "ALIRAN (L/s)" },
  { key: "status", label: "STATUS" },
];

export default function TableUI() {
  const [allData, setAllData] = useState<SensorData[]>([]);
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/sensors.json");
        const sensors = await res.json();
        const transformedData = (sensors || []).map((sensor: any) => ({
          id: sensor.id,
          created_at: sensor.created_at,
          turbidity: sensor.kekeruhan,
          phmeter: sensor.phmeter,
          waterflow: sensor.waterflow,
          temp: sensor.temp,
        }));
        setAllData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        console.error("Error loading sensors data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Status calculation functions
  const getOverallStatus = (turbidity: number, ph: number, temp: number, flow: number) => {
    const turbidityStatus = turbidity <= 100 ? 'excellent' : turbidity <= 500 ? 'good' : turbidity <= 1500 ? 'warning' : 'danger';
    const phStatus = (ph >= 6.5 && ph <= 8.5) ? 'excellent' : (ph >= 6.0 && ph <= 9.0) ? 'good' : (ph >= 5.5 && ph <= 9.5) ? 'warning' : 'danger';
    const tempStatus = (temp >= 20 && temp <= 30) ? 'excellent' : (temp >= 15 && temp <= 35) ? 'good' : (temp >= 10 && temp <= 38) ? 'warning' : 'danger';
    const flowStatus = (flow >= 2.0 && flow <= 5.0) ? 'excellent' : (flow >= 1.5 && flow <= 6.0) ? 'good' : (flow >= 1.0 && flow <= 7.0) ? 'warning' : 'danger';
    
    const statuses = [turbidityStatus, phStatus, tempStatus, flowStatus];
    
    if (statuses.includes('danger')) return 'danger';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.filter(s => s === 'excellent').length >= 3) return 'excellent';
    return 'good';
  };

  // Filter data based on search, status, and date
  useEffect(() => {
    let filtered = [...allData];

    // Search filter
    if (searchValue) {
      filtered = filtered.filter(item => 
        item.id.toString().includes(searchValue) ||
        item.turbidity.toString().includes(searchValue) ||
        item.phmeter.toString().includes(searchValue) ||
        item.temp.toString().includes(searchValue) ||
        item.waterflow.toString().includes(searchValue)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => {
        const status = getOverallStatus(item.turbidity, item.phmeter, item.temp, item.waterflow);
        return status === statusFilter;
      });
    }

    // Date filter
    if (dateFilter) {
      const selectedDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at).toDateString();
        return itemDate === selectedDate;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [allData, searchValue, statusFilter, dateFilter]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderCell = (item: SensorData, columnKey: string) => {
    switch (columnKey) {
      case "created_at":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {new Date(item.created_at).toLocaleDateString('id-ID')}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(item.created_at).toLocaleTimeString('id-ID')}
            </span>
          </div>
        );
      case "turbidity":
        const turbidityStatus = item.turbidity <= 100 ? 'excellent' : item.turbidity <= 500 ? 'good' : item.turbidity <= 1500 ? 'warning' : 'danger';
        return (
          <span className={`font-medium ${
            turbidityStatus === 'excellent' ? 'text-emerald-400' :
            turbidityStatus === 'good' ? 'text-blue-400' :
            turbidityStatus === 'warning' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {item.turbidity}
          </span>
        );
      case "phmeter":
        const phStatus = (item.phmeter >= 6.5 && item.phmeter <= 8.5) ? 'excellent' : (item.phmeter >= 6.0 && item.phmeter <= 9.0) ? 'good' : (item.phmeter >= 5.5 && item.phmeter <= 9.5) ? 'warning' : 'danger';
        return (
          <span className={`font-medium ${
            phStatus === 'excellent' ? 'text-emerald-400' :
            phStatus === 'good' ? 'text-blue-400' :
            phStatus === 'warning' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {item.phmeter.toFixed(1)}
          </span>
        );
      case "temp":
        const tempStatus = (item.temp >= 20 && item.temp <= 30) ? 'excellent' : (item.temp >= 15 && item.temp <= 35) ? 'good' : (item.temp >= 10 && item.temp <= 38) ? 'warning' : 'danger';
        return (
          <span className={`font-medium ${
            tempStatus === 'excellent' ? 'text-emerald-400' :
            tempStatus === 'good' ? 'text-blue-400' :
            tempStatus === 'warning' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {item.temp.toFixed(1)}
          </span>
        );
      case "waterflow":
        const flowStatus = (item.waterflow >= 2.0 && item.waterflow <= 5.0) ? 'excellent' : (item.waterflow >= 1.5 && item.waterflow <= 6.0) ? 'good' : (item.waterflow >= 1.0 && item.waterflow <= 7.0) ? 'warning' : 'danger';
        return (
          <span className={`font-medium ${
            flowStatus === 'excellent' ? 'text-emerald-400' :
            flowStatus === 'good' ? 'text-blue-400' :
            flowStatus === 'warning' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {item.waterflow.toFixed(1)}
          </span>
        );
      case "status":
        const overallStatus = getOverallStatus(item.turbidity, item.phmeter, item.temp, item.waterflow);
        return (
          <Chip
            size="sm"
            variant="flat"
            color={
              overallStatus === 'excellent' ? 'success' :
              overallStatus === 'good' ? 'primary' :
              overallStatus === 'warning' ? 'warning' : 'danger'
            }
          >
            {overallStatus === 'excellent' ? 'Sangat Baik' :
             overallStatus === 'good' ? 'Baik' :
             overallStatus === 'warning' ? 'Peringatan' : 'Bahaya'}
          </Chip>
        );
      default:
        return item[columnKey as keyof SensorData];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <Input
          isClearable
          placeholder="Cari data..."
          startContent={<Search className="w-4 h-4 text-slate-400" />}
          value={searchValue}
          onValueChange={setSearchValue}
          className="sm:max-w-xs"
          classNames={{
            input: "text-white",
            inputWrapper: "bg-slate-700 border-slate-600"
          }}
        />
        
        <Select
          placeholder="Filter berdasarkan status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:max-w-xs"
          classNames={{
            trigger: "bg-slate-700 border-slate-600",
            value: "text-white",
            listbox: "bg-slate-700"
          }}
        >
          <SelectItem key="all" value="all">Semua Status</SelectItem>
          <SelectItem key="excellent" value="excellent">Sangat Baik</SelectItem>
          <SelectItem key="good" value="good">Baik</SelectItem>
          <SelectItem key="warning" value="warning">Peringatan</SelectItem>
          <SelectItem key="danger" value="danger">Bahaya</SelectItem>
        </Select>

        <Input
          type="date"
          placeholder="Filter berdasarkan tanggal"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="sm:max-w-xs"
          classNames={{
            input: "text-white",
            inputWrapper: "bg-slate-700 border-slate-600"
          }}
        />
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">
          Menampilkan {currentData.length} dari {filteredData.length} data
        </span>
        {(searchValue || statusFilter !== "all" || dateFilter) && (
          <Button
            size="sm"
            variant="flat"
            onClick={() => {
              setSearchValue("");
              setStatusFilter("all");
              setDateFilter("");
            }}
            className="text-slate-400 hover:text-white"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Table */}
      <Table 
        aria-label="Water Quality Sensor Data Table"
        classNames={{
          wrapper: "bg-transparent",
          table: "bg-slate-800/50",
          th: "bg-slate-700 text-slate-300 font-semibold",
          td: "border-b border-slate-700"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={currentData} emptyContent="Tidak ada data ditemukan">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            classNames={{
              wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
              item: "w-8 h-8 text-small rounded-none bg-transparent",
              cursor: "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
            }}
          />
        </div>
      )}
    </div>
  );
}