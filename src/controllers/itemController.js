import Item from '../models/Item.js';

const validStates = ['activo', 'inactivo', 'pendiente'];

const parsePrice = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
};

const parseStock = (value) => {
  const number = Number(value);
  return Number.isInteger(number) ? number : NaN;
};

// Obtener todos los items
export const getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Item.getAllByUser(userId);

    const totalStock = items.reduce((sum, item) => sum + Number(item.stock), 0);
    const inventoryValue = items.reduce((sum, item) => sum + Number(item.valor_total || 0), 0);

    res.status(200).json({
      message: 'Items obtenidos correctamente',
      count: items.length,
      summary: {
        totalItems: items.length,
        totalStock,
        inventoryValue: Number(inventoryValue.toFixed(2))
      },
      items
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
      item
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
    const { nombre, descripcion, estado, price, stock, categoria } = req.body;
    const userId = req.user.id;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return res.status(400).json({
        error: 'Nombre inválido',
        message: 'El nombre es requerido y debe tener al menos 3 caracteres'
      });
    }

    if (estado && !validStates.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: `El estado debe ser uno de: ${validStates.join(', ')}`
      });
    }

    const parsedPrice = parsePrice(price ?? 0);
    const parsedStock = parseStock(stock ?? 0);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        error: 'Precio inválido',
        message: 'El precio debe ser un número mayor o igual a 0'
      });
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        error: 'Stock inválido',
        message: 'El stock debe ser un entero mayor o igual a 0'
      });
    }

    if (estado === 'activo' && parsedStock === 0) {
      return res.status(400).json({
        error: 'Stock requerido',
        message: 'Un item activo debe tener stock mayor a 0'
      });
    }

    const existingItem = await Item.findByNameAndUser(nombre.trim(), userId);
    if (existingItem) {
      return res.status(409).json({
        error: 'Nombre duplicado',
        message: 'Ya existe un item con ese nombre para este usuario'
      });
    }

    const item = await Item.create(
      nombre.trim(),
      descripcion || '',
      estado || 'activo',
      parsedPrice,
      parsedStock,
      categoria || 'general',
      userId
    );

    res.status(201).json({
      message: 'Item creado exitosamente',
      item
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
    const { nombre, descripcion, estado, price, stock, categoria } = req.body;
    const userId = req.user.id;

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

    if (estado && !validStates.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: `El estado debe ser uno de: ${validStates.join(', ')}`
      });
    }

    const parsedPrice = parsePrice(price ?? 0);
    const parsedStock = parseStock(stock ?? 0);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        error: 'Precio inválido',
        message: 'El precio debe ser un número mayor o igual a 0'
      });
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        error: 'Stock inválido',
        message: 'El stock debe ser un entero mayor o igual a 0'
      });
    }

    if (estado === 'activo' && parsedStock === 0) {
      return res.status(400).json({
        error: 'Stock requerido',
        message: 'Un item activo debe tener stock mayor a 0'
      });
    }

    const existingItem = await Item.findByNameAndUser(nombre.trim(), userId);
    if (existingItem && existingItem.id !== Number(id)) {
      return res.status(409).json({
        error: 'Nombre duplicado',
        message: 'Ya existe un item con ese nombre para este usuario'
      });
    }

    const item = await Item.update(
      id,
      nombre.trim(),
      descripcion || '',
      estado || 'activo',
      parsedPrice,
      parsedStock,
      categoria || 'general',
      userId
    );

    res.status(200).json({
      message: 'Item actualizado correctamente',
      item
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
      result
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
