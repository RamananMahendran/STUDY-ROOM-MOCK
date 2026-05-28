import pool from '../config/db.js';

class Problem {
  // Get all problems with filters
  static async findAll(filters = {}) {
    const { difficulty, tags, search, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, title, difficulty, tags, 
             array_length(tags, 1) as tag_count,
             created_at
      FROM problems
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;
    
    if (difficulty) {
      query += ` AND difficulty = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      query += ` AND tags && $${paramIndex}`;
      params.push(tagArray);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM problems WHERE 1=1';
    const countParams = [];
    let countIndex = 1;
    
    if (difficulty) {
      countQuery += ` AND difficulty = $${countIndex}`;
      countParams.push(difficulty);
      countIndex++;
    }
    if (tags) {
      countQuery += ` AND tags && $${countIndex}`;
      countParams.push(tags.split(','));
      countIndex++;
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${countIndex} OR description ILIKE $${countIndex})`;
      countParams.push(`%${search}%`);
      countIndex++;
    }
    
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count);
    
    return {
      problems: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  // Get single problem by ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT id, title, description, difficulty, tags, test_cases, 
              created_at, updated_at
       FROM problems 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }
  
  // Create new problem
  static async create(problemData) {
    const { title, description, difficulty, tags, test_cases } = problemData;
    const result = await pool.query(
      `INSERT INTO problems (title, description, difficulty, tags, test_cases)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, difficulty, created_at`,
      [title, description, difficulty, tags || [], test_cases || '[]']
    );
    return result.rows[0];
  }
  
  // Update problem
  static async update(id, problemData) {
    const { title, description, difficulty, tags, test_cases } = problemData;
    const result = await pool.query(
      `UPDATE problems 
       SET title = $1, description = $2, difficulty = $3, 
           tags = $4, test_cases = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, description, difficulty, tags, test_cases, id]
    );
    return result.rows[0];
  }
  
  // Delete problem
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM problems WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

export default Problem;