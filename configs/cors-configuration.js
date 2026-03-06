const cordOptions = {
    //Permite que cualquier origen accede a la API
    orgin: true,
    //Permite que la API RECIBA Y ENVIE cookies
    credentials: true,
    //Establece los metodos permitidos en la Api
    methods: "GET,POST,PUT,DELETE",

    allowedHeaders: "Content-Type,Authorization"
}

export { cordOptions }