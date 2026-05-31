import prisma from '../../config/database.js'; // Prisma client
class Problem {
    static async findAll(filters = {}) {
        const { difficulty, tags, search } = filters;
        const page = Math.max(Number(filters.page) || 1, 1);
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];
        if (difficulty) {
            params.push(difficulty);
            conditions.push(`difficulty = $${params.length}`);
        }
        if (tags) {
            const tagList = String(tags).split(',').map((tag) => tag.trim()).filter(Boolean);
            if (tagList.length > 0) {
                params.push(tagList);
                conditions.push(`tags && $${params.length}`);
            }
        }
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        params.push(limit, offset);
        const problems = await prisma.$queryRawUnsafe(`
      SELECT id, title, slug, difficulty, tags, array_length(tags, 1) as tag_count, created_at
      FROM problems
      ${whereClause}
      ORDER BY id
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `, ...params);
        const countParams = params.slice(0, -2);
        const countResult = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) FROM problems
      ${whereClause}
    `, ...countParams);
        const total = parseInt(countResult[0].count);
        return {
            problems,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
        };
    }
    static async findById(id) {
        const problemId = Number(id);
        if (!Number.isInteger(problemId))
            return undefined;
        const rows = await prisma.$queryRaw `
      SELECT id, title, slug, description, difficulty, tags, test_cases, created_at, updated_at
      FROM problems WHERE id = ${problemId}
    `;
        return rows[0];
    }
    static async create(problemData) {
        const { title, description, difficulty, tags, test_cases } = problemData;
        const slug = problemData.slug || Problem.slugify(title);
        const testCases = typeof test_cases === 'string'
            ? test_cases
            : JSON.stringify(test_cases || []);
        const rows = await prisma.$queryRaw `
      INSERT INTO problems (title, slug, description, difficulty, tags, test_cases, updated_at)
      VALUES (${title}, ${slug}, ${description}, ${difficulty}, ${tags || []}, ${testCases}::jsonb, CURRENT_TIMESTAMP)
      RETURNING id, title, slug, difficulty, created_at
    `;
        return rows[0];
    }
    static async update(id, problemData) {
        const problemId = Number(id);
        if (!Number.isInteger(problemId))
            return undefined;
        const { title, description, difficulty, tags, test_cases } = problemData;
        const slug = problemData.slug || Problem.slugify(title);
        const testCases = typeof test_cases === 'string'
            ? test_cases
            : JSON.stringify(test_cases || []);
        const rows = await prisma.$queryRaw `
      UPDATE problems
      SET title = ${title},
          slug = ${slug},
          description = ${description},
          difficulty = ${difficulty},
          tags = ${tags || []},
          test_cases = ${testCases}::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${problemId}
      RETURNING id, title, slug, description, difficulty, tags, test_cases, created_at, updated_at
    `;
        return rows[0];
    }
    static async delete(id) {
        const problemId = Number(id);
        if (!Number.isInteger(problemId))
            return undefined;
        const rows = await prisma.$queryRaw `
      DELETE FROM problems
      WHERE id = ${problemId}
      RETURNING id
    `;
        return rows[0];
    }
    static slugify(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
export default Problem;
// import pool from '../config/db.js';
// class Problem {
//   // Get all problems with filters
//   static async findAll(filters = {}) {
//     const { difficulty, tags, search, page = 1, limit = 20 } = filters;
//     const offset = (page - 1) * limit;
//     let query = `
//       SELECT id, title, difficulty, tags, 
//              array_length(tags, 1) as tag_count,
//              created_at
//       FROM problems
//       WHERE 1=1
//     `;
//     const params = [];
//     let paramIndex = 1;
//     if (difficulty) {
//       query += ` AND difficulty = $${paramIndex}`;
//       params.push(difficulty);
//       paramIndex++;
//     }
//     if (tags) {
//       const tagArray = tags.split(',');
//       query += ` AND tags && $${paramIndex}`;
//       params.push(tagArray);
//       paramIndex++;
//     }
//     if (search) {
//       query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
//       params.push(`%${search}%`);
//       paramIndex++;
//     }
//     query += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
//     params.push(limit, offset);
//     const result = await pool.query(query, params);
//     // Get total count
//     let countQuery = 'SELECT COUNT(*) FROM problems WHERE 1=1';
//     const countParams = [];
//     let countIndex = 1;
//     if (difficulty) {
//       countQuery += ` AND difficulty = $${countIndex}`;
//       countParams.push(difficulty);
//       countIndex++;
//     }
//     if (tags) {
//       countQuery += ` AND tags && $${countIndex}`;
//       countParams.push(tags.split(','));
//       countIndex++;
//     }
//     if (search) {
//       countQuery += ` AND (title ILIKE $${countIndex} OR description ILIKE $${countIndex})`;
//       countParams.push(`%${search}%`);
//       countIndex++;
//     }
//     const totalResult = await pool.query(countQuery, countParams);
//     const total = parseInt(totalResult.rows[0].count);
//     return {
//       problems: result.rows,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         totalPages: Math.ceil(total / limit)
//       }
//     };
//   }
//   // Get single problem by ID
//   static async findById(id) {
//     const result = await pool.query(
//       `SELECT id, title, description, difficulty, tags, test_cases, 
//               created_at, updated_at
//        FROM problems 
//        WHERE id = $1`,
//       [id]
//     );
//     return result.rows[0];
//   }
//   // Create new problem
//   static async create(problemData) {
//     const { title, description, difficulty, tags, test_cases } = problemData;
//     const result = await pool.query(
//       `INSERT INTO problems (title, description, difficulty, tags, test_cases)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING id, title, difficulty, created_at`,
//       [title, description, difficulty, tags || [], test_cases || '[]']
//     );
//     return result.rows[0];
//   }
//   // Update problem
//   static async update(id, problemData) {
//     const { title, description, difficulty, tags, test_cases } = problemData;
//     const result = await pool.query(
//       `UPDATE problems 
//        SET title = $1, description = $2, difficulty = $3, 
//            tags = $4, test_cases = $5, updated_at = CURRENT_TIMESTAMP
//        WHERE id = $6
//        RETURNING *`,
//       [title, description, difficulty, tags, test_cases, id]
//     );
//     return result.rows[0];
//   }
//   // Delete problem
//   static async delete(id) {
//     const result = await pool.query(
//       'DELETE FROM problems WHERE id = $1 RETURNING id',
//       [id]
//     );
//     return result.rows[0];
//   }
// }
// export default Problem;
