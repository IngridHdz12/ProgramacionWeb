const db = require('../config/mysql');

exports.selectPedidos=async()=>{
    let resultado = await db.promise()
    .query('SELECT id_pedido,  nombre_cliente, domicilio, total FROM pedido');
    console.log(resultado);
    return resultado [0];
}

exports.selectMenu=async()=>{
    let resultado = await db.promise()
    .query('SELECT id_producto, nombre_producto, descripcion, precio, categoria FROM menu');
    console.log(resultado);
    return resultado [0];
}

exports.selectPedido = async (id_pedido)=>{
    let resultado /*[rows, fields]*/ = await db.promise().query(
        'SELECT id_pedido,  nombre_cliente, domicilio, total FROM pedido WHERE id_pedido =?',
        [id_pedido]
    );
    console.log(resultado);
    return resultado[0].length ? resultado[0][0] : undefined; 

}
exports.selectProducto = async (id_producto) => {
    let resultado = await db.promise().query(
        'SELECT id_producto, nombre_producto, descripcion, precio, categoria FROM menu WHERE id_producto = ?',
        [id_producto]
    );
    console.log(resultado);
    return resultado[0].length ? resultado[0][0] : undefined; // Devuelve el primer producto encontrado o undefined
};


exports.insertPedido = async ( id_pedido,  nombre_cliente, domicilio, total)=>{
    let result /*[rows, fields]*/ = await db.promise().query(
        'INSERT INTO pedido ( id_pedido,  nombre_cliente, domicilio, total) VALUES (?,?,?,?)',
        [ id_pedido, nombre_cliente, domicilio, total]
    );
    return result[0].insertId;
}

exports.insertProducto = async (nombre_producto, descripcion, precio, categoria) => {
    let result = await db.promise().query(
        'INSERT INTO menu (nombre_producto, descripcion, precio, categoria) VALUES (?, ?, ?, ?)',
        [nombre_producto, descripcion, precio, categoria]
    );
    return result[0].insertId; // Retorna el ID generado automáticamente para el nuevo producto
};

exports.updatePedido = async (id_pedido, nombre_cliente, domicilio, total) => {
    try {
        console.log('Datos enviados a updatePedido:', {
            id_pedido,  nombre_cliente, domicilio, total
        });

        let [result] = await db.promise().execute(
            'UPDATE pedido SET nombre_cliente = ?, domicilio = ?, total = ? WHERE id_pedido = ?',
            [nombre_cliente, domicilio, total, id_pedido]
        );

        console.log('Resultado de la consulta:', result);
        return result.affectedRows; // Retorna las filas afectadas
    } catch (error) {
        console.error('Error en updatePedido:', error);
        throw error; // Lanza el error para que se maneje en otro lugar
    }
};


exports.updateProducto=async(id_producto, nombre_producto, descripcion, precio, categoria, )=>{
    let result=await db.promise().execute(
        'UPDATE menu SET nombre_producto =?, descripcion =?, precio =?, categoria =? WHERE id_producto=?',
        [ nombre_producto, descripcion, precio, categoria,id_producto]
    );
    return result[0].affectedRows;
}


exports.deletePedido=async(id_pedido)=>{
    let result=await db.promise().execute(
        'DELETE FROM pedido WHERE id_pedido=?',
        [id_pedido]
    );
    return result[0].affectedRows;
}
exports.deleteProducto=async(id_producto)=>{
    let result=await db.promise().execute(
        'DELETE FROM menu WHERE id_producto=?',
        [id_producto]
    );
    return result[0].affectedRows;
}