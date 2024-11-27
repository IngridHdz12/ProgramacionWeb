const db = require('../config/mysql');

const {
    selectPedidos,
    selectPedido,
    insertPedido,
    updatePedido,    
    deletePedido,

    selectMenu,
    selectProducto,
    insertProducto,
    updateProducto,    
    deleteProducto,
} = require('../dal/mysql');

exports.getPedido = async(req, res) => {
    const { id_pedido } = req.params;
    try{      
        const pedido =await selectPedido(id_pedido);
        if(!pedido){
            return res.status(404).json('El pedido buscado no existe');
        } else{
            res.status(200).json(pedido);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }    
}

exports.getProducto = async(req, res) => {
    const { id_producto } = req.params;
    try{      
        const producto =await selectProducto(id_producto);
        if(!producto){
            return res.status(404).json('El producto buscado no existe');
        } else{
            res.status(200).json(producto);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }    
}

exports.getPedidos = async (req, res) => {
    const pedidos = await selectPedidos();
    if(!pedidos){
        return res.status(404).json('Los pedidos no existen');
    } else{
        res.status(200).json(pedidos);
    }
}

exports.getMenu = async (req, res) => {
    const productos = await selectMenu();
    if(!productos){
        return res.status(404).json('El producto no existe');
    } else{
        res.status(200).json(productos);
    }
}

exports.editPedido = async (req, res) => {
    const { id_pedido } = req.params;
    const {  nombre_cliente, domicilio, total } = req.body;

    // // Validar campos requeridos
    // if ( !nombre_cliente || !domicilio ||!total) {
    //     return res.status(400).json({ message: 'Todos los campos excepto "total" son requeridos.' });
    // }

    // Validar tipos de datos
    if (typeof nombre_cliente !== 'string' || typeof domicilio !== 'string' ) {
        return res.status(400).json({ message: 'Los campos "nombre_cliente", "domicilio" y "estado" deben ser cadenas de texto.' });
    }

    // Validar rango
    if (total !== undefined && (isNaN(total) || total < 0)) {
        return res.status(400).json({ message: 'El campo "total" debe ser un número positivo.' });
    }

    try {
        const filasAfectadas = await updatePedido(id_pedido,  nombre_cliente, domicilio, total || 0);
        if (filasAfectadas === 0) {
            return res.status(404).json({ message: `No se encontró el pedido con ID ${id_pedido}.` });
        }
        res.status(200).json({ message: `Pedido ${id_pedido} actualizado correctamente.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editProducto = async (req, res) => {
    const { id_producto } = req.params;
    const { nombre_producto, descripcion, precio, categoria,  } = req.body;

    // Validar campos requeridos
    if (!nombre_producto || !descripcion || !precio || !categoria ) {
        return res.status(400).json({ message: 'Todos los campos son necesarios.' });
    }

    // Validar tipos de datos
    if (typeof nombre_producto !== 'string' || typeof descripcion !== 'string' || typeof categoria !== 'string' ){
        return res.status(400).json({ message: 'Los campos "nombre de producto", "domicilio" y "categonia" deben ser cadenas de texto.' });
    }
 
    // Validar rango
    if (precio !== undefined && (isNaN(precio) || precio < 0)) {
        return res.status(400).json({ message: 'El campo "precio" debe ser un número positivo.' });
    }

    try {
        const filasAfectadas = await updateProducto(id_producto, nombre_producto, descripcion, precio, categoria,  );
        if (filasAfectadas === 0) {
            return res.status(404).json({ message: `No se encontró el producto con ID ${id_producto}.` });
        }
        res.status(200).json({ message: `Producto ${id_producto} actualizado correctamente.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPedido = async (req, res) => {
    const { id_pedido,  nombre_cliente, domicilio, total } = req.body;

    // Validar campos requeridos
    if ( !nombre_cliente || !domicilio ) {
        return res.status(400).json({ message: 'Todos los campos excepto "total" son requeridos.' });
    }

    // Validar tipos de datos
    if (typeof nombre_cliente !== 'string' || typeof domicilio !== 'string' ) {
        return res.status(400).json({ message: 'Los campos "nombre_cliente", "domicilio" y "estado" deben ser cadenas de texto.' });
    }

    // Validar rango
    if (total !== undefined && (isNaN(total) || total < 0)) {
        return res.status(400).json({ message: 'El campo "total" debe ser un número positivo.' });
    }

    // Evitar duplicados
    try {
        const pedidoExistente = await selectPedido(id_pedido);
        if (pedidoExistente) {
            return res.status(400).json({ message: `Ya existe un pedido con el ID ${id_pedido}.` });
        }

        const insertId = await insertPedido(id_pedido, nombre_cliente, domicilio, total || 0);
        res.status(200).json({ message: `Se creó el pedido de ${nombre_cliente} con ID: ${insertId}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProducto = async (req, res) => {
    const { nombre_producto, descripcion, precio, categoria } = req.body;

    // Validar campos requeridos
    if (!nombre_producto || !descripcion || !precio || !categoria) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    // Validar tipos de datos
    if (typeof nombre_producto !== 'string' || typeof descripcion !== 'string' || typeof categoria !== 'string') {
        return res.status(400).json({
            message: 'Los campos "nombre_producto", "descripcion" y "categoria" deben ser cadenas de texto.',
        });
    }

    // Validar rango
    if (isNaN(precio) || precio < 0) {
        return res.status(400).json({ message: 'El campo "precio" debe ser un número positivo.' });
    }

    // Insertar el producto
    try {
        const insertId = await insertProducto(nombre_producto, descripcion, parseFloat(precio), categoria);
        res.status(200).json({ message: `Producto creado exitosamente con ID: ${insertId}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deletePedido= async(req, res)=>{
    try{
        const{id_pedido}=req.params;

       const filasAfectadas=await deletePedido(id_pedido);

        if (filasAfectadas==1){
            res.status(200).json('Se elimino el pedido '+ id_pedido );
        }else{
            res.status(404).json('No se elimino ningun pedido');
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}
exports.deleteProducto= async(req, res)=>{
    try{
        const{id_producto}=req.params;

       const filasAfectadas=await deleteProducto(id_producto);

        if (filasAfectadas==1){
            res.status(200).json('Se elimino el producto '+ id_producto );
        }else{
            res.status(404).json('No se elimino ningun producto');
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}