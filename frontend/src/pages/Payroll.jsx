import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Download, FileText, DollarSign } from "lucide-react";
import apiClient from "../utils/apiclients";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("january-2024");

  // Fetch data from the dummy API
  useEffect(() => {
    const fetchPayroll = async () => {
      const data = await apiClient.getPayroll("/payroll");
      setPayrollData(data);
    };
    fetchPayroll();
  }, []);

  const filteredPayroll = payrollData.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      emp.month.toLowerCase() === selectedMonth.replace("-", " ")
  );

  const totalPayroll = filteredPayroll.reduce((sum, emp) => sum + emp.netPay, 0);
  const totalBonus = filteredPayroll.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalDeductions = filteredPayroll.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalPayslips = filteredPayroll.length;


  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Payroll Management</h1>
        <p className="page-subtitle">Manage payslips and salary disbursements.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <DollarSign size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p>
              <p className="text-sm text-muted-foreground">Total Payroll</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10">
              <FileText size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Payslips Generated</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10">
              <DollarSign size={20} className="text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(31500)}</p>
              <p className="text-sm text-muted-foreground">Total Bonuses</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10">
              <DollarSign size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(20500)}</p>
              <p className="text-sm text-muted-foreground">Total Deductions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Payslips</h2>
          <div className="flex items-center gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january-2024">January 2024</SelectItem>
                <SelectItem value="december-2023">December 2023</SelectItem>
                <SelectItem value="november-2023">November 2023</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search employee..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Employee</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayroll.map((employee) => (
                <TableRow key={employee.id} className="table-row-hover">
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.month}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.basic)}</TableCell>
                  <TableCell className="text-right text-success">
                    +{formatCurrency(employee.bonus)}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    -{formatCurrency(employee.deductions)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(employee.netPay)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download size={14} />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
