// src/modules/practice/problemModel.ts
import prisma from '../../config/database.js'; // Prisma client
class Problem {
    // 1. Fetch all with filters and pagination
    static async findAll(filters = {}) {
        const { difficulty, tags, search } = filters;
        const page = Math.max(Number(filters.page) || 1, 1);
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const where = {};
        if (difficulty) {
            where.difficulty = difficulty;
        }
        if (tags) {
            const tagList = String(tags)
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean);
            if (tagList.length > 0) {
                where.tags = {
                    hasSome: tagList
                };
            }
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [totalItems, problems] = await prisma.$transaction([
            prisma.problem.count({ where }),
            prisma.problem.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return {
            problems,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        };
    }
    // 2. Fetch single entry by ID
    static async findById(id) {
        if (!id)
            return undefined;
        // TypeScript clean casting: if the schema expects a number, convert it to a number.
        // If it's a UUID string, keep it as a string.
        const targetId = typeof id === 'string' && !isNaN(Number(id)) && !id.includes('-')
            ? Number(id)
            : id;
        return await prisma.problem.findUnique({
            where: { id: targetId }
        });
    }
    // 3. Create a new entry
    static async create(problemData) {
        const { title, description, difficulty, tags, test_cases } = problemData;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return await prisma.problem.create({
            data: {
                title,
                slug,
                description,
                difficulty,
                tags: tags || [],
                testCases: typeof test_cases === 'string' ? JSON.parse(test_cases) : (test_cases || [])
            }
        });
    }
    // 4. Update an existing entry
    static async update(id, problemData) {
        if (!id)
            return undefined;
        const targetId = typeof id === 'string' && !isNaN(Number(id)) && !id.includes('-')
            ? Number(id)
            : id;
        const { title, description, difficulty, tags, test_cases } = problemData;
        const updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        if (description)
            updateData.description = description;
        if (difficulty)
            updateData.difficulty = difficulty;
        if (tags)
            updateData.tags = tags;
        if (test_cases) {
            updateData.testCases = typeof test_cases === 'string' ? JSON.parse(test_cases) : test_cases;
        }
        try {
            return await prisma.problem.update({
                where: { id: targetId },
                data: updateData
            });
        }
        catch (error) {
            return undefined;
        }
    }
    // 5. Delete an entry
    static async delete(id) {
        if (!id)
            return undefined;
        const targetId = typeof id === 'string' && !isNaN(Number(id)) && !id.includes('-')
            ? Number(id)
            : id;
        try {
            return await prisma.problem.delete({
                where: { id: targetId }
            });
        }
        catch (error) {
            return undefined;
        }
    }
}
export default Problem;
