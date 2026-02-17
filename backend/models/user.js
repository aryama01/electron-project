class Manager {
    constructor({
                    firstName,
                    lastName,
                    email,
                    phone,
                    department,
                    designation,
                    employeeId, status
                }) {
        this.id = Date.now().toString(); // temporary unique id
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.employeeId = employeeId;
        this.createdAt = new Date();
        this.status = status || "active"; // default status

    }
}

module.exports = Manager;
