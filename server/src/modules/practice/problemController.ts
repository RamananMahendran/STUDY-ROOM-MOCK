import { Request, Response } from 'express';
import Problem from './problemModel.js'; // Adjusted path according to your new file structure

// Get all problems with filters
export const getAllProblems = async (req: Request, res: Response): Promise<any> => {
  try {
    const { difficulty, tags, search, page, limit } = req.query;

    // Typecast query items safely before sending to the database layer
    const result = await Problem.findAll({
      difficulty: difficulty ? String(difficulty) : undefined,
      tags: tags ? String(tags) : undefined,
      search: search ? String(search) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
    
    return res.json({
      success: true,
      data: result.problems,
      pagination: result.pagination
    });
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get single problem by ID
export const getProblemById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    // Explicitly guarantee it's a primitive string to satisfy the Model signature
    const problem = await Problem.findById(String(id));
    
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    
    return res.json({ success: true, data: problem });
  } catch (error: any) {
    console.error('Error fetching problem:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create new problem (admin only - will add auth later)
export const createProblem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, difficulty, tags, test_cases } = req.body;
    
    // Validation
    if (!title || !description || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, difficulty'
      });
    }
    
    const newProblem = await Problem.create({ title, description, difficulty, tags, test_cases });
    
    return res.status(201).json({
      success: true,
      data: newProblem,
      message: 'Problem created successfully'
    });
  } catch (error: any) {
    console.error('Error creating problem:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update problem (admin only)
export const updateProblem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, tags, test_cases } = req.body;
    
    const updatedProblem = await Problem.update(String(id), { title, description, difficulty, tags, test_cases });
    
    if (!updatedProblem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    
    return res.json({
      success: true,
      data: updatedProblem,
      message: 'Problem updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating problem:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete problem (admin only)
export const deleteProblem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    const deletedProblem = await Problem.delete(String(id));
    
    if (!deletedProblem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    
    return res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting problem:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};




// import Problem from '../models/problemModel.js';

// // Get all problems with filters
// export const getAllProblems = async (req, res) => {
//   try {
//     const { difficulty, tags, search, page, limit } = req.query;
//     const result = await Problem.findAll({ difficulty, tags, search, page, limit });
    
//     res.json({
//       success: true,
//       data: result.problems,
//       pagination: result.pagination
//     });
//   } catch (error) {
//     console.error('Error fetching problems:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get single problem by ID
// export const getProblemById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const problem = await Problem.findById(id);
    
//     if (!problem) {
//       return res.status(404).json({ success: false, error: 'Problem not found' });
//     }
    
//     res.json({ success: true, data: problem });
//   } catch (error) {
//     console.error('Error fetching problem:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Create new problem (admin only - will add auth later)
// export const createProblem = async (req, res) => {
//   try {
//     const { title, description, difficulty, tags, test_cases } = req.body;
    
//     // Validation
//     if (!title || !description || !difficulty) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields: title, description, difficulty'
//       });
//     }
    
//     const newProblem = await Problem.create({ title, description, difficulty, tags, test_cases });
    
//     res.status(201).json({
//       success: true,
//       data: newProblem,
//       message: 'Problem created successfully'
//     });
//   } catch (error) {
//     console.error('Error creating problem:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update problem (admin only)
// export const updateProblem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, difficulty, tags, test_cases } = req.body;
    
//     const updatedProblem = await Problem.update(id, { title, description, difficulty, tags, test_cases });
    
//     if (!updatedProblem) {
//       return res.status(404).json({ success: false, error: 'Problem not found' });
//     }
    
//     res.json({
//       success: true,
//       data: updatedProblem,
//       message: 'Problem updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating problem:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Delete problem (admin only)
// export const deleteProblem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedProblem = await Problem.delete(id);
    
//     if (!deletedProblem) {
//       return res.status(404).json({ success: false, error: 'Problem not found' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Problem deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting problem:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
