const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let data = [
  { id: 1, name: 'Pastel de Chocolate', description: 'Delicioso pastel de chocolate' },
  { id: 2, name: 'Tarta de Fresa', description: 'Tarta con fresas frescas' },
];

// Obtener todos los datos
app.get('/api/data', (req, res) => {
  res.json(data);
});

// Agregar un nuevo postre
app.post('/api/data', (req, res) => {
  const { id, name, description } = req.body;

  if (id && name && description) {
    if (data.some(item => item.id == id)) {
      return res.status(400).json({ message: 'El ID ya existe' });
    }
    data.push({ id: Number(id), name, description });
    res.status(201).json({ message: 'Postre agregado correctamente' });
  } else {
    res.status(400).json({ message: 'Formato de datos incorrecto' });
  }
});

// Eliminar un postre por ID
app.delete('/api/data/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.findIndex(item => item.id === id);

  if (index !== -1) {
    data.splice(index, 1);
    res.json({ message: 'Postre eliminado correctamente' });
  } else {
    res.status(404).json({ message: 'Postre no encontrado' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
