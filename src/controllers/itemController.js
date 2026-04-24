import Item from '../models/Item.js';

// Obtener todos los items
export const getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Item.getAllByUser(userId);

    res.status(200).json({
      message: 'Items obtenidos correctamente',
      count: items.length,
      items: items
    });
  } catch (error) {
    console.error('Error en getAllItems:', error.message);
    res.status(500).json({
      error: 'Error al obtener items',
      message: error.message
    });
  }
};

// Obtener un item por ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número válido'
      });
    }

    const item = await Item.getById(id, userId);

    if (!item) {
      return res.status(404).json({
        error: 'Item no encontrado',
        message: 'El item solicitado no existe o no pertenece al usuario'
      });
    }

    res.status(200).json({
      message: 'Item obtenido correctamente',
      item: item
    });
  } catch (error) {
    console.error('Error en getItemById:', error.message);
    res.status(500).json({
      error: 'Error al obtener item',
      message: error.message
    });
  }
};

// Crear un nuevo item
export const createItem = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!nombre || typeof nombre !== 'string') {
      return res.status(400).json({
        error: 'Nombre requerido',
        message: 'El nombre es requerido y debe ser texto'
      });
    }

    if (nombre.trim().length < 3) {
      return res.status(400).json({
        error: 'Nombre muy corto',
        message: 'El nombre debe tener al menos 3 caracteres'
      });
    }

    const validStates = ['activo', 'inactivo', 'pendiente'];
    if (estado && !validStates.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: `El estado debe ser uno de: ${validStates.join(', ')}`
      });
    }

    const item = await Item.create(nombre, descripcion || '', estado || 'activo', userId);

    res.status(201).json({
      message: 'Item creado exitosamente',
      item: item
    });
  } catch (error) {
    console.error('Error en createItem:', error.message);
    res.status(500).json({
      error: 'Error al crear item',
      message: error.message
    });
  }
};

// Actualizar un item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número válido'
      });
    }

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return res.status(400).json({
        error: 'Nombre inválido',
        message: 'El nombre es requerido y debe tener al menos 3 caracteres'
      });
    }

    const validStates = ['activo', 'inactivo', 'pendiente'];
    if (estado && !validStates.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: `El estado debe ser uno de: ${validStates.join(', ')}`
      });
    }

    const item = await Item.update(id, nombre, descripcion || '', estado, userId);

    res.status(200).json({
      message: 'Item actualizado correctamente',
      item: item
    });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Item no encontrado',
        message: error.message
      });
    }
    console.error('Error en updateItem:', error.message);
    res.status(500).json({
      error: 'Error al actualizar item',
      message: error.message
    });
  }
};

// Eliminar un item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número válido'
      });
    }

    const result = await Item.delete(id, userId);

    res.status(200).json({
      message: 'Item eliminado correctamente',
      result: result
    });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Item no encontrado',
        message: error.message
      });
    }
    console.error('Error en deleteItem:', error.message);
    res.status(500).json({
      error: 'Error al eliminar item',
      message: error.message
    });
  }
};

export default {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
