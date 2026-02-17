import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import apiclients from "../utils/apiclients.js";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AddEmployee() {
    const [employeeForm, setEmployeeForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        team: "",
        role: "",
        phone: "",
        department: "",
        joiningDate: "",
    });

    const handleEmployeeSubmit = (e) => {
        e.preventDefault();
        console.log("Employee added:", employeeForm);

        // TODO: connect to backend API here
        const res = apiclients.employeeCreate(employeeForm);

        setEmployeeForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            team: "",
            role: "",
            phone: "",
            department: "",
            joiningDate: "",
        });
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Add New Employee</h1>
            </div>

            <div className="bg-card rounded-2xl p-6 card-shadow">
                <form onSubmit={handleEmployeeSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name *</Label>
                            <Input
                                value={employeeForm.firstName}
                                onChange={(e) =>
                                    setEmployeeForm((p) => ({
                                        ...p,
                                        firstName: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Last Name *</Label>
                            <Input
                                value={employeeForm.lastName}
                                onChange={(e) =>
                                    setEmployeeForm((p) => ({
                                        ...p,
                                        lastName: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            value={employeeForm.email}
                            onChange={(e) =>
                                setEmployeeForm((p) => ({
                                    ...p,
                                    email: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Password *</Label>
                        <Input
                            type="password"
                            value={employeeForm.password}
                            onChange={(e) =>
                                setEmployeeForm((p) => ({
                                    ...p,
                                    password: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <Separator />

                    <Button type="submit">Add Employee</Button>
                </form>
            </div>
        </div>
    );
}
