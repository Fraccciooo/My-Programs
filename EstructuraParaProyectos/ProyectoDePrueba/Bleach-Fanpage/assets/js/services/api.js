// Simulación de datos de API
export const getCharacters = async () => {
    // En un proyecto real, aquí harías una petición fetch a una API
    return [
        {
            id: 1,
            name: "Ichigo Kurosaki",
            role: "Sustituto Shinigami",
            zanpakuto: "Zangetsu",
            ability: "Getsuga Tenshō"
        },
        {
            id: 2,
            name: "Rukia Kuchiki",
            role: "Shinigami",
            zanpakuto: "Sode no Shirayuki",
            ability: "Danza de la Luna Blanca"
        }
    ];
};

export const getArcs = async () => {
    return [
        {
            id: 1,
            name: "Saga del Agente Sustituto",
            episodes: "1-20",
            villain: "Grand Fisher",
            keyEvents: "Ichigo obtiene sus poderes de Shinigami"
        },
        {
            id: 2,
            name: "Saga de la Sociedad de Almas",
            episodes: "21-63",
            villain: "Byakuya Kuchiki",
            keyEvents: "Rescate de Rukia"
        }
    ];
};