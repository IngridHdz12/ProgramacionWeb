const API_PEDIDOS_URL = 'http://localhost:3000/Coffee/pedido/';
const API_MENU_URL = 'http://localhost:3000/Coffee/menu/';
const API_PRODUCTO_URL = 'http://localhost:3000/Coffee/producto/';



// Función para cargar la tabla de menú
async function cargarMenu() {
    try {
        const response = await fetch('http://localhost:3000/Coffee/menu/');
        const productos = await response.json();

        const tbody = document.getElementById('menu-table').querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla

        productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td >${producto.id_producto}</td>
                <td class="editable" data-column="nombre_producto">${producto.nombre_producto}</td>
                <td class="editable" data-column="descripcion">${producto.descripcion}</td>
                <td class="editable" data-column="precio">${producto.precio}</td>
                <td class="editable" data-column="categoria">${producto.categoria}</td> <!-- Celda para la categoría -->
                <td>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>                    
                    <button class="save-btn" style="display: none;">Guardar</button>
                </td> <!-- Celda para las acciones -->
            `;
            tbody.appendChild(fila);
        });

        // Asociar eventos a los botones
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', habilitarEdicion);
        });
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', guardarEdicion);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => 
            btn.addEventListener('click', eliminarProducto)
        );
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}
cargarMenu();



function habilitarEdicion(event) {
    const fila = event.target.closest('tr');
    fila.querySelectorAll('.editable').forEach(celda => {
        const valorActual = celda.textContent;
        celda.innerHTML = `<input type="text" value="${valorActual}" data-original="${valorActual}">`;
    });

    // Mostrar el botón "Guardar" y ocultar "Editar"
    fila.querySelector('.edit-btn').style.display = 'none';
    fila.querySelector('.save-btn').style.display = 'inline-block';
}
function habilitarEdicionPedido(event) {
    const fila = event.target.closest('tr');
    fila.querySelectorAll('.editable').forEach(celda => {
        const valorActual = celda.textContent;
        celda.innerHTML = `<input type="text" value="${valorActual}" data-original="${valorActual}">`;
    });

    // Mostrar el botón "Guardar" y ocultar "Editar"
    fila.querySelector('.edit-pedido').style.display = 'none';
    fila.querySelector('.save-pedido').style.display = 'inline-block';
}


async function guardarEdicion(event) {
    const fila = event.target.closest('tr');
    const idProducto = fila.cells[0].textContent; // ID Producto
    const datosActualizados = {};

    // Recoger los datos de las celdas editables
    fila.querySelectorAll('.editable').forEach(celda => {
        const input = celda.querySelector('input');
        if (input) {
            const columna = celda.dataset.column;
            datosActualizados[columna] = input.value;
        }
    });

    try {
        // Hacer la solicitud PUT al backend
        const response = await fetch(`http://localhost:3000/Coffee/producto/${idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            alert('Producto actualizado con éxito');
            
            // Actualizar la fila con los nuevos datos
            fila.querySelectorAll('.editable').forEach(celda => {
                const input = celda.querySelector('input');
                if (input) {
                    celda.textContent = input.value; // Actualizar el texto de la celda con el valor del input
                }
            });

            // Restaurar los botones
            fila.querySelector('.edit-btn').style.display = 'inline-block';
            fila.querySelector('.save-btn').style.display = 'none';

            // Hacer que las celdas se vuelvan no editables nuevamente
            fila.querySelectorAll('.editable').forEach(celda => {
                const input = celda.querySelector('input');
                if (input) {
                    celda.textContent = input.value; // Cambiar input por texto
                }
            });
        } else {
            alert('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error al guardar cambios:', error);
    }
}

// Función para cargar la tabla de pedidos
async function cargarPedidos() {
    try {
        const response = await fetch(API_PEDIDOS_URL);
        const pedidos = await response.json();

        const tbody = document.getElementById('pedidos-table').querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla

        // const tableBody = document.querySelector('#pedidos-table tbody');
        // tableBody.innerHTML = ''; // Limpiar la tabla

        pedidos.forEach(pedido => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${pedido.id_pedido}</td>
               
                <td class="editable" data-column="nombre_cliente">${pedido.nombre_cliente}</td>
                <td class="editable" data-column="domicilio">${pedido.domicilio}</td>
                
                <td class="editable" data-column="total">${pedido.total}</td> 
               
                <td>
                    <button class="edit-pedido" data-id="${pedido.id_pedido}">Editar</button>
                    <button class="delete-pedido" data-id="${pedido.id_pedido}">Eliminar</button>
                    <button class="save-pedido" style="display: none;">Guardar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        document.querySelectorAll('.edit-pedido').forEach(btn => 
            btn.addEventListener('click', habilitarEdicionPedido)            
        );
        document.querySelectorAll('.save-pedido').forEach(btn => {
            btn.addEventListener('click', guardarEdicionPedido);
        });
        document.querySelectorAll('.delete-pedido').forEach(btn => 
            btn.addEventListener('click', eliminarPedido)
        );
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
    }
}
cargarPedidos()

async function guardarEdicionPedido(event) {
    const fila = event.target.closest('tr');
    const idPedido = fila.cells[0].textContent; // ID del pedido
    const datosActualizados = {};

    // Recoger los datos de las celdas editables
    fila.querySelectorAll('.editable').forEach(celda => {
        const input = celda.querySelector('input');
        if (input) {
            const columna = celda.dataset.column;
            datosActualizados[columna] = input.value;
        }
    });


    console.log(datosActualizados.domicilio);
    

    if (
        datosActualizados.nombre_cliente === "" || 
        datosActualizados.domicilio === "" || 

        datosActualizados.total === "" ) {
        alert('Por favor, completa todos los campos requeridos.');
        return; 
    }
    
    if (typeof datosActualizados.nombre_cliente !== 'string' || typeof datosActualizados.domicilio !== 'string' ) {
        alert('Los campos "nombre_cliente", "domicilio" y "estado" deben ser texto.');
        return; // Evita el envío si no son cadenas de texto
    }

    try {
        const response = await fetch(`${API_PEDIDOS_URL}${idPedido}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (response.ok) {
            alert('Pedido actualizado con éxito');

            // Actualizar las celdas con los nuevos valores
            fila.querySelectorAll('.editable').forEach(celda => {
                const input = celda.querySelector('input');
                if (input) {
                    celda.textContent = input.value; // Actualizar el contenido de la celda
                }
            });

            // Restaurar los botones
            fila.querySelector('.edit-pedido').style.display = 'inline-block';
            fila.querySelector('.save-pedido').style.display = 'none';
        } else {
            alert('Error al actualizar el pedido');
        }
    } catch (error) {
        console.error('Error al guardar cambios del pedido:', error);
    }
}

function eliminarProducto(event) {
    const fila = event.target.closest('tr'); // Encuentra la fila correspondiente al botón
    const idProducto = fila.cells[0].textContent; // Obtiene el id_producto de la primera celda
    console.log('ID del producto:', idProducto);

    if (!idProducto) {
        console.error('Error: El ID no está definido o es inválido.');
        return;
    }

    fetch(`${API_PRODUCTO_URL}${idProducto}`, {
        method: 'DELETE'
    })
    .then(() => {
        console.log(`Producto con ID ${idProducto} eliminado con éxito.`);
        cargarMenu(); // Recargar el menú
    })
    .catch(error => console.error('Error al eliminar producto:', error));
}
// Función para eliminar un pedido
function eliminarPedido(event) {
    const id = event.target.dataset.id;

    fetch(`${API_PEDIDOS_URL}${id}`, {
        method: 'DELETE'
    }).then(() => cargarPedidos())
      .catch(error => console.error('Error al eliminar pedido:', error));
}









// Inicializar la carga de tablas
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    cargarPedidos();

    const createProductBtn = document.getElementById('create-product-btn');
    const createProductModal = document.getElementById('create-product-modal');
    const createProductForm = document.getElementById('create-product-form');
    const closeCreateProductModal = document.getElementById('close-create-product-modal');
    const menuTable = document.getElementById('menu-table').querySelector('tbody');

    // Mostrar el modal al hacer clic en "Crear Producto"
    createProductBtn.addEventListener('click', () => {
        createProductModal.style.display = 'block';
    });

    // Cerrar el modal al hacer clic en "Cancelar"
    closeCreateProductModal.addEventListener('click', () => {
        createProductModal.style.display = 'none';
        createProductForm.reset();
    });

    // Manejar el envío del formulario
    createProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Capturar los valores del formulario
        const newProduct = {
            nombre_producto: document.getElementById('create-product-name').value,
            descripcion: document.getElementById('create-product-description').value,
            precio: parseFloat(document.getElementById('create-product-price').value),
            categoria: document.getElementById('create-product-category').value,
        };

        try {
            // Enviar los datos al servidor mediante fetch
            const response = await fetch('http://localhost:3000/Coffee/producto/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const addedProduct = await response.json();

                // Agregar una nueva fila a la tabla
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${addedProduct.id_producto}</td>
                    <td>${addedProduct.nombre_producto}</td>
                    <td>${addedProduct.descripcion}</td>
                    <td>${addedProduct.precio}</td>
                    <td>${addedProduct.categoria}</td>
                    <td>
                        <button class="edit-btn" data-id="${addedProduct.id_producto}">Editar</button>
                        <button class="delete-btn" data-id="${addedProduct.id_producto}">Eliminar</button>
                    </td>
                `;
                menuTable.appendChild(newRow);

                // Cerrar el modal y resetear el formulario
                createProductModal.style.display = 'none';
                createProductForm.reset();
                cargarMenu();
            } else {
                console.error('Error al crear el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    });
});



