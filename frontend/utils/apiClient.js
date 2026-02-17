const BASE_URL = "http://localhost:5000/api";

export const apiClient = {
    createManager: async (managerData) => {
        const response = await fetch(`${BASE_URL}/managers/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(managerData)
        });

        return response.json();
    },

    getManagers: async () => {
        const response = await fetch(`${BASE_URL}/managers`);
        return response.json();
    }
};
