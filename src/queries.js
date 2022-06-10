const DB_USER = process.env.DB_USER || "postgres";
const DB_HOST = process.env.DB_HOST || "containers-us-west-52.railway.app";
const DATABASE = process.env.DATABASE || "railway";
const PASS = process.env.PASS || "8m2iRRzEufbwoszh4VNV";
const PORT = process.env.PORT || 6110;

const Pool = require('pg').Pool;
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DATABASE,
    password: PASS,
    port: PORT,
})

/**
 * creates tables A and S if dont exist
 * @param {*} request 
 * @param {*} response 
 */
const createTablesIfDontExist = async () => {
    try {
        const query = await pool.query(`
            CREATE TABLE IF NOT EXISTS "tabla_s" (
                "id" INTEGER,
                "timestamp" VARCHAR(500) NOT NULL,
                "hash" VARCHAR(500) NOT NULL);
            CREATE TABLE IF NOT EXISTS "tabla_a" (
                "id" INTEGER,
                "timestamp" VARCHAR(500) NOT NULL,
                "respuesta" VARCHAR(500), 
                "hash" VARCHAR(500) NOT NULL);`);
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
}

/**
 * checks if connection exists
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const checkConnection = async (request, response) => {
    try {
        const check = await pool.query('SELECT NOW()');
        return check.rows[0].now !== undefined ? "ok" : "nok";
    } catch (error) {
        return "nok";
    }
}

/**
 * creates a new hash from id and timestamp
 * @param {*} request 
 * @param {*} response 
 */
const createNewHash = (request, response) => {
    const { id } = request.params;
    const timestamp = Date.now();
    const hash = `${id}${timestamp}`;

    pool.query('INSERT INTO tabla_s (id, timestamp, hash) VALUES ($1, $2, $3) RETURNING *', [id, timestamp, hash], (error, results) => {
        if (error) {
            response.status(400).json({ status: "error", data: error.message ? error.message : "error" });
            return;
        }
        response.status(201).json({
            status: "success",
            data: {
                hash: results.rows[0].hash
            }
        });
    })
}

/**
 * creates a new entry into tabla_s data
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const saveValidation = async (consulta) => {
    const { id, hash, timestamp, isValid } = consulta;
    try {
        pool.query('INSERT INTO tabla_a (id, timestamp, hash, respuesta) VALUES ($1, $2, $3, $4) RETURNING *', [id, timestamp, hash, isValid], (error, results) => {
            if (error) {
                response.status(400).json({ status: "error", data: error.message ? error.message : "error" });
                return;
            }
        })
    } catch (error) {
        return "nok";
    }
}


/**
 * given an id and a hash validates
 * @param {*} request 
 * @param {*} response 
 */
const validateHash = (request, response) => {
    const { id } = request.params;
    const { hash } = request.query;

    const rawQuery = `SELECT * FROM tabla_s WHERE id=${id} AND hash='${hash}'`;
    var queryResponse;
    var isValid = "nok";
    pool.query(rawQuery, (error, results) => {
        if (error) {
            response.status(400).json({ status: "error", data: error.message ? error.message : "error" });
            return;
        }
        queryResponse = results.rows[0];
        if (queryResponse !== undefined) {
            let currentDaete = new Date(parseInt(Date.now()));
            let hashDate = new Date(parseInt(queryResponse.timestamp));
            var hours = Math.floor(Math.abs(currentDaete - hashDate) / 36e5);
            console.log({ currentDate: currentDaete.toTimeString(), hashDate: hashDate.toTimeString(), greater: currentDaete > hashDate, hours });
            if (hours < 3) {
                isValid = "ok"
            }
        }
        const consulta = { id, hash, timestamp: Date.now(), isValid };
        console.log("Guardando los datos de la consulta en la tabla a...", consulta)
        saveValidation(consulta);
        response.status(201).json({ status: "success", data: isValid });
    });
}

/**
 * get all s table info
 * @param {*} request 
 * @param {*} response 
 */
const getAllSTableInfo = (request, response) => {
    const rawQuery = `SELECT * FROM tabla_s`;
    var queryResponse;
    pool.query(rawQuery, (error, results) => {
        if (error) {
            response.status(400).json({ status: "error", data: error.message ? error.message : "error" });
            return;
        }
        queryResponse = results.rows;
        response.status(201).json({ status: "success", data: queryResponse });
    });
}

/**
 * get all a table info
 * @param {*} request 
 * @param {*} response 
 */
const getAllATableInfo = (request, response) => {
    const rawQuery = `SELECT * FROM tabla_a`;
    var queryResponse;
    pool.query(rawQuery, (error, results) => {
        if (error) {
            response.status(400).json({ status: "error", data: error.message ? error.message : "error" });
            return;
        }
        queryResponse = results.rows;
        response.status(201).json({ status: "success", data: queryResponse });
    });
}

/**
 * delete all info for all tables
 * @param {*} request 
 * @param {*} response 
 */
const deleteAllInfo = (request, response) => {
    let rawQuery = `
    DELETE FROM tabla_a;
    DELETE FROM tabla_s`;
    var queryResponse;
    pool.query(rawQuery, (error, results) => {
        if (error) {
            response.status(400).json({ status: "error", data: error.message ? error.message : "error" });
            return;
        }
        queryResponse = results.rows;
        response.status(201).json({ status: "success" });
    });
}

module.exports = {
    createTablesIfDontExist,
    checkConnection,
    createNewHash,
    validateHash,
    getAllSTableInfo,
    getAllATableInfo,
    deleteAllInfo
};