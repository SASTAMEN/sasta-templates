const Component = require('../models/Component');

const componentController = {
  // Get all components
  getAll: async (req, res) => {
    try {
      const components = await Component.find();
      res.json(components);
    } catch (err) {
      console.error('Error fetching components:', err);
      res.status(500).json({ message: 'Error fetching components' });
    }
  },

  // Get components by category
  getByCategory: async (req, res) => {
    try {
      const components = await Component.find({ category: req.params.category });
      res.json(components);
    } catch (err) {
      console.error('Error fetching components by category:', err);
      res.status(500).json({ message: 'Error fetching components by category' });
    }
  },

  // Get component by ID
  getById: async (req, res) => {
    try {
      const component = await Component.findById(req.params.id);
      if (!component) {
        return res.status(404).json({ message: 'Component not found' });
      }
      res.json(component);
    } catch (err) {
      console.error('Error fetching component:', err);
      res.status(500).json({ message: 'Error fetching component' });
    }
  },

  // Create new component
  create: async (req, res) => {
    try {
      const { name, description, category, code, styles, preview, tags } = req.body;
      
      const newComponent = new Component({
        name,
        description,
        category,
        code,
        styles,
        preview,
        tags
      });

      await newComponent.save();
      res.status(201).json(newComponent);
    } catch (err) {
      console.error('Error creating component:', err);
      res.status(500).json({ message: 'Error creating component' });
    }
  },

  // Update component
  update: async (req, res) => {
    try {
      const { name, description, category, code, styles, preview, tags } = req.body;
      
      const component = await Component.findById(req.params.id);
      if (!component) {
        return res.status(404).json({ message: 'Component not found' });
      }

      component.name = name || component.name;
      component.description = description || component.description;
      component.category = category || component.category;
      component.code = code || component.code;
      component.styles = styles || component.styles;
      component.preview = preview || component.preview;
      component.tags = tags || component.tags;

      await component.save();
      res.json(component);
    } catch (err) {
      console.error('Error updating component:', err);
      res.status(500).json({ message: 'Error updating component' });
    }
  },

  // Delete component
  delete: async (req, res) => {
    try {
      const component = await Component.findByIdAndDelete(req.params.id);
      if (!component) {
        return res.status(404).json({ message: 'Component not found' });
      }
      res.json({ message: 'Component deleted successfully' });
    } catch (err) {
      console.error('Error deleting component:', err);
      res.status(500).json({ message: 'Error deleting component' });
    }
  }
};

module.exports = componentController; 