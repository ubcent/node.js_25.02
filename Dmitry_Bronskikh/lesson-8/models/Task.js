const getQuery = require('./DBHelper');

const tableName = 'tasks';

class Task {

    static getAll() {
        return getQuery(`SELECT * FROM  ${tableName}`);
    }

    static async getOn(id) {
        const [result] = await getQuery(`SELECT * FROM  ${tableName} WHERE id = ?`, id);
        return result;
    }

    static async add(obj) {
        const {insertId} = await getQuery(`INSERT INTO ${tableName} SET ?`, obj);
        return insertId;
    }

    static async delete(id) {
        const {affectedRows} = await getQuery(`DELETE FROM ${tableName} WHERE  id = ?`, id);
        return affectedRows;
    }

    static update(obj) {
        return getQuery(`UPDATE ${tableName} SET ? WHERE id =?`, [obj, obj.id]);
    }
}

module.exports = Task;
