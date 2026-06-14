import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:prar0210thna@localhost:5432/studyplatform?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { generateStarterCode } from '../utils/starterCodeGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
interface ProblemData {
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
  examples: string;
  constraints: string;
  hints: string[];
  leetcodeUrl: string;
}

// Helper function to normalize difficulty to match database constraint (lowercase)
function normalizeDifficulty(difficulty: string): string {
  const normalized = difficulty.trim().toLowerCase();
  
  if (normalized === 'easy' || normalized === 'ease') return 'easy';
  if (normalized === 'medium' || normalized === 'med') return 'medium';
  if (normalized === 'hard' || normalized === 'difficult') return 'hard';
  
  console.warn(`Unknown difficulty: "${difficulty}", defaulting to medium`);
  return 'medium';
}

function parseValue(valStr: string): any {
  const clean = valStr.trim().replace(/^["']|["']$/g, '');
  if (clean === 'true') return true;
  if (clean === 'false') return false;
  if (clean === 'null') return null;
  
  if (!isNaN(clean as any) && clean !== '') {
    return Number(clean);
  }
  
  try {
    const jsonStr = clean.replace(/'/g, '"');
    return JSON.parse(jsonStr);
  } catch (e) {
    return clean;
  }
}

function parseInputVariables(inputStr: string): Record<string, any> {
  const result: Record<string, any> = {};
  const clean = inputStr.replace(/`/g, '').trim();
  
  const parts: string[] = [];
  let bracketDepth = 0;
  let inQuotes = false;
  let currentPart = '';
  
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char === '[' || char === '{') bracketDepth++;
    else if (char === ']' || char === '}') bracketDepth--;
    else if (char === '"' || char === "'") inQuotes = !inQuotes;
    
    if (char === ',' && bracketDepth === 0 && !inQuotes) {
      parts.push(currentPart.trim());
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }
  
  for (const part of parts) {
    const eqIdx = part.indexOf('=');
    if (eqIdx !== -1) {
      const varName = part.substring(0, eqIdx).trim().replace(/^\*+|\*+$/g, '').trim();
      const varValueStr = part.substring(eqIdx + 1).trim();
      result[varName] = parseValue(varValueStr);
    } else {
      result['input'] = parseValue(part);
    }
  }
  
  return result;
}

function parseExamples(content: string): any[] {
  const testCases: any[] = [];
  const lines = content.split('\n');
  let currentInput: any = null;
  let currentExpected: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    const inputMatch = line.match(/(?:Input|Input:)\s*\*?\*?\s*:\s*(.+)/i) || line.match(/(?:Input|Input:)\s*\*?\*?\s*(.+)/i);
    if (inputMatch) {
      const inputStr = inputMatch[1].trim().replace(/^\*+|\*+$/g, '').replace(/^`|`$/g, '').replace(/```/g, '').trim();
      currentInput = parseInputVariables(inputStr);
      continue;
    }
    
    const outputMatch = line.match(/(?:Output|Output:)\s*\*?\*?\s*:\s*(.+)/i) || line.match(/(?:Output|Output:)\s*\*?\*?\s*(.+)/i);
    if (outputMatch && currentInput) {
      const outputStr = outputMatch[1].trim().replace(/^\*+|\*+$/g, '').replace(/^`|`$/g, '').replace(/```/g, '').trim();
      currentExpected = parseValue(outputStr);
      testCases.push({
        input: currentInput,
        expected: currentExpected,
        description: `Example ${testCases.length + 1}`
      });
      currentInput = null;
      currentExpected = null;
    }
  }
  
  return testCases;
}

// ── Parser ────────────────────────────────────────────────────────────────────
function parseMarkdownFile(content: string): ProblemData {
  const titleMatch = content.match(/^#\s+(?:\d+\.\s+)?(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const difficultyMatch = content.match(/\*\*Difficulty:\*\*\s*(\w+)/);
  const difficulty = difficultyMatch ? difficultyMatch[1].trim() : 'Medium';

  const topicMatch = content.match(/\*\*Topic:\*\*\s*(.+)/);
  const topics = topicMatch ? topicMatch[1].split(',').map(t => t.trim()) : [];

  const tagsMatch = content.match(/\*\*Tags:\*\*\s*(.+)/);
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];
  const allTopics = [...new Set([...topics, ...tags])];

  const urlMatch = content.match(/\*\*LeetCode:\*\*\s*(https?:\/\/\S+)/);
  const leetcodeUrl = urlMatch ? urlMatch[1].trim() : '';

  const problemMatch = content.match(/## Problem\s+([\s\S]+?)(?=\n---|\n## |$)/);
  let description = '';
  let examples = '';

  if (problemMatch) {
    const problemContent = problemMatch[1].trim();
    const exampleBlocks = problemContent.match(/```[\s\S]+?```/g);
    if (exampleBlocks) {
      examples = exampleBlocks.join('\n\n');
    }
    description = problemContent
      .replace(/```[\s\S]+?```/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  const constraintsMatch = content.match(/\*\*Constraints:\*\*\s*([\s\S]+?)(?=\n## |\n---|\*\*Hint|$)/);
  let constraints = '';
  if (constraintsMatch) {
    constraints = constraintsMatch[1].replace(/```/g, '').trim();
  }

  const hintsSection = content.match(/## Hints\s+([\s\S]+?)(?=\n## |$)/);
  let hints: string[] = [];
  if (hintsSection) {
    hints = hintsSection[1]
      .split('\n')
      .filter(line => line.trim().match(/^\*\*Hint \d+/))
      .map(line => line.replace(/\*\*Hint \d+:\*\*\s*/, '').trim());
  }

  return { title, difficulty, topics: allTopics, description, examples, constraints, hints, leetcodeUrl };
}

// ── Slug ──────────────────────────────────────────────────────────────────────
function generateSlug(title: string, problemNumber?: number): string {
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (problemNumber) slug = `${problemNumber}-${slug}`;
  return slug;
}

// ── Enhanced Examples Generator for ALL Problems ────────────────────────────────
function generateExamples(title: string): string {
  const t = title.toLowerCase();
  
  const examples: Record<string, string> = {
    // Arrays & Hashing
    'contains duplicate': `**Example 1:**
\`\`\`
Input: nums = [1,2,3,1]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,2,3,4]
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
\`\`\``,

    'valid anagram': `**Example 1:**
\`\`\`
Input: s = "anagram", t = "nagaram"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "rat", t = "car"
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input: s = "", t = ""
Output: true
\`\`\``,

    'two sum': `**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\``,

    'group anagrams': `**Example 1:**
\`\`\`
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\`

**Example 2:**
\`\`\`
Input: strs = [""]
Output: [[""]]
\`\`\`

**Example 3:**
\`\`\`
Input: strs = ["a"]
Output: [["a"]]
\`\`\``,

    'top k frequent': `**Example 1:**
\`\`\`
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1], k = 1
Output: [1]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,2,3,4,5], k = 3
Output: [1,2,3]
\`\`\``,

    'product of array except self': `**Example 1:**
\`\`\`
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [2,2,2]
Output: [4,4,4]
\`\`\``,

    'valid sudoku': `**Example 1:**
\`\`\`
Input: board = 
[["5","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 [".","9","8",".",".",".",".","6","."],
 ["8",".",".",".","6",".",".",".","3"],
 ["4",".",".","8",".","3",".",".","1"],
 ["7",".",".",".","2",".",".",".","6"],
 [".","6",".",".",".",".","2","8","."],
 [".",".",".","4","1","9",".",".","5"],
 [".",".",".",".","8",".",".","7","9"]]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: board with duplicate in row
Output: false
\`\`\``,

    'encode and decode': `**Example 1:**
\`\`\`
Input: ["lint","code","love","you"]
Output: ["lint","code","love","you"]
Explanation: encode -> decode should return original
\`\`\`

**Example 2:**
\`\`\`
Input: ["hello","world"]
Output: ["hello","world"]
\`\`\``,

    'longest consecutive': `**Example 1:**
\`\`\`
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: Longest consecutive sequence is [1,2,3,4]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
\`\`\`

**Example 3:**
\`\`\`
Input: nums = []
Output: 0
\`\`\``,

    // Two Pointers
    'valid palindrome': `**Example 1:**
\`\`\`
Input: s = "A man, a plan, a canal: Panama"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "race a car"
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input: s = " "
Output: true
\`\`\``,

    'two sum ii': `**Example 1:**
\`\`\`
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
\`\`\`

**Example 2:**
\`\`\`
Input: numbers = [2,3,4], target = 6
Output: [1,3]
\`\`\`

**Example 3:**
\`\`\`
Input: numbers = [-1,0], target = -1
Output: [1,2]
\`\`\``,

    '3sum': `**Example 1:**
\`\`\`
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0,1,1]
Output: []
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [0,0,0]
Output: [[0,0,0]]
\`\`\``,

    'container with most water': `**Example 1:**
\`\`\`
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
\`\`\`

**Example 2:**
\`\`\`
Input: height = [1,1]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: height = [4,3,2,1,4]
Output: 16
\`\`\``,

    'trapping rain water': `**Example 1:**
\`\`\`
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
\`\`\`

**Example 2:**
\`\`\`
Input: height = [4,2,0,3,2,5]
Output: 9
\`\`\`

**Example 3:**
\`\`\`
Input: height = [1,2,3,4]
Output: 0
\`\`\``,

    // Sliding Window
    'best time to buy and sell stock': `**Example 1:**
\`\`\`
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy at 1, sell at 6
\`\`\`

**Example 2:**
\`\`\`
Input: prices = [7,6,4,3,1]
Output: 0
\`\`\`

**Example 3:**
\`\`\`
Input: prices = [1]
Output: 0
\`\`\``,

    'longest substring without repeating': `**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: s = "pwwkew"
Output: 3
\`\`\`

**Example 4:**
\`\`\`
Input: s = ""
Output: 0
\`\`\``,

    'longest repeating character replacement': `**Example 1:**
\`\`\`
Input: s = "ABAB", k = 2
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: s = "AABABBA", k = 1
Output: 4
\`\`\`

**Example 3:**
\`\`\`
Input: s = "AAAA", k = 2
Output: 4
\`\`\``,

    'permutation in string': `**Example 1:**
\`\`\`
Input: s1 = "ab", s2 = "eidbaooo"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s1 = "ab", s2 = "eidboaoo"
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input: s1 = "abc", s2 = "bbbca"
Output: true
\`\`\``,

    'minimum window substring': `**Example 1:**
\`\`\`
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "a", t = "a"
Output: "a"
\`\`\`

**Example 3:**
\`\`\`
Input: s = "a", t = "aa"
Output: ""
\`\`\``,

    'sliding window maximum': `**Example 1:**
\`\`\`
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1], k = 1
Output: [1]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [7,2,4], k = 2
Output: [7,4]
\`\`\``,

    // Stack
    'valid parentheses': `**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\`

**Example 4:**
\`\`\`
Input: s = "([])"
Output: true
\`\`\``,

    'min stack': `**Example 1:**
\`\`\`
Input: ["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]
\`\`\``,

    'evaluate reverse polish': `**Example 1:**
\`\`\`
Input: tokens = ["2","1","+","3","*"]
Output: 9
\`\`\`

**Example 2:**
\`\`\`
Input: tokens = ["4","13","5","/","+"]
Output: 6
\`\`\`

**Example 3:**
\`\`\`
Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
\`\`\``,

    'generate parentheses': `**Example 1:**
\`\`\`
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
\`\`\`

**Example 2:**
\`\`\`
Input: n = 1
Output: ["()"]
\`\`\`

**Example 3:**
\`\`\`
Input: n = 2
Output: ["(())","()()"]
\`\`\``,

    'daily temperatures': `**Example 1:**
\`\`\`
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
\`\`\`

**Example 2:**
\`\`\`
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
\`\`\``,

    'car fleet': `**Example 1:**
\`\`\`
Input: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: target = 10, position = [3], speed = [3]
Output: 1
\`\`\``,

    'largest rectangle in histogram': `**Example 1:**
\`\`\`
Input: heights = [2,1,5,6,2,3]
Output: 10
\`\`\`

**Example 2:**
\`\`\`
Input: heights = [2,4]
Output: 4
\`\`\``,

    // Binary Search
    'binary search': `**Example 1:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [5], target = 5
Output: 0
\`\`\``,

    'search a 2d matrix': `**Example 1:**
\`\`\`
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
\`\`\``,

    'koko eating bananas': `**Example 1:**
\`\`\`
Input: piles = [3,6,7,11], h = 8
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: piles = [30,11,23,4,20], h = 5
Output: 30
\`\`\``,

    'find minimum in rotated sorted array': `**Example 1:**
\`\`\`
Input: nums = [3,4,5,1,2]
Output: 1
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2]
Output: 0
\`\`\``,

    'search in rotated sorted array': `**Example 1:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
\`\`\``,

    'time based key-value': `**Example 1:**
\`\`\`
Input: 
["TimeMap","set","get","get","set","get","get"]
[[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]
Output: [null,null,"bar","bar",null,"bar2","bar2"]
\`\`\``,

    'median of two sorted arrays': `**Example 1:**
\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0
\`\`\`

**Example 2:**
\`\`\`
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.5
\`\`\``,

    // Linked List
    'reverse linked list': `**Example 1:**
\`\`\`
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2]
Output: [2,1]
\`\`\``,

    'merge two sorted lists': `**Example 1:**
\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
\`\`\`

**Example 2:**
\`\`\`
Input: list1 = [], list2 = []
Output: []
\`\`\``,

    'reorder list': `**Example 1:**
\`\`\`
Input: head = [1,2,3,4]
Output: [1,4,2,3]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]
\`\`\``,

    'remove nth node from end': `**Example 1:**
\`\`\`
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1], n = 1
Output: []
\`\`\``,

    'copy list with random pointer': `**Example 1:**
\`\`\`
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: Deep copy of the list
\`\`\``,

    'add two numbers': `**Example 1:**
\`\`\`
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807
\`\`\`

**Example 2:**
\`\`\`
Input: l1 = [0], l2 = [0]
Output: [0]
\`\`\``,

    'linked list cycle': `**Example 1:**
\`\`\`
Input: head = [3,2,0,-4], pos = 1
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2], pos = 0
Output: true
\`\`\``,

    'find the duplicate number': `**Example 1:**
\`\`\`
Input: nums = [1,3,4,2,2]
Output: 2
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,1,3,4,2]
Output: 3
\`\`\``,

    'lru cache': `**Example 1:**
\`\`\`
Input: ["LRUCache","put","put","get","put","get","put","get","get","get"]
[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
Output: [null,null,null,1,null,-1,null,-1,3,4]
\`\`\``,

    'merge k sorted lists': `**Example 1:**
\`\`\`
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
\`\`\``,

    'reverse nodes in k-group': `**Example 1:**
\`\`\`
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
\`\`\``,

    // Trees
    'invert binary tree': `**Example 1:**
\`\`\`
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
\`\`\`

**Example 2:**
\`\`\`
Input: root = [2,1,3]
Output: [2,3,1]
\`\`\``,

    'maximum depth of binary tree': `**Example 1:**
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1,null,2]
Output: 2
\`\`\``,

    'diameter of binary tree': `**Example 1:**
\`\`\`
Input: root = [1,2,3,4,5]
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1,2]
Output: 1
\`\`\``,

    'balanced binary tree': `**Example 1:**
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false
\`\`\``,

    'same tree': `**Example 1:**
\`\`\`
Input: p = [1,2,3], q = [1,2,3]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: p = [1,2], q = [1,null,2]
Output: false
\`\`\``,

    'subtree of another tree': `**Example 1:**
\`\`\`
Input: root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true
\`\`\``,

    'lowest common ancestor of a binary search tree': `**Example 1:**
\`\`\`
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
\`\`\``,

    'binary tree level order traversal': `**Example 1:**
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
\`\`\``,

    'binary tree right side view': `**Example 1:**
\`\`\`
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]
\`\`\``,

    'count good nodes in binary tree': `**Example 1:**
\`\`\`
Input: root = [3,1,4,3,null,1,5]
Output: 4
\`\`\``,

    'validate binary search tree': `**Example 1:**
\`\`\`
Input: root = [2,1,3]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: root = [5,1,4,null,null,3,6]
Output: false
\`\`\``,

    'kth smallest element in a bst': `**Example 1:**
\`\`\`
Input: root = [3,1,4,null,2], k = 1
Output: 1
\`\`\``,

    'construct binary tree from preorder and inorder': `**Example 1:**
\`\`\`
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
\`\`\``,

    'binary tree maximum path sum': `**Example 1:**
\`\`\`
Input: root = [1,2,3]
Output: 6
\`\`\``,

    'serialize and deserialize binary tree': `**Example 1:**
\`\`\`
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
\`\`\``,

    // Tries
    'implement trie': `**Example 1:**
\`\`\`
Input: 
["Trie","insert","search","search","startsWith","insert","search"]
[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]
Output: [null,null,true,false,true,null,true]
\`\`\``,

    'design add and search words': `**Example 1:**
\`\`\`
Input:
["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
Output: [null,null,null,null,false,true,true,true]
\`\`\``,

    'word search ii': `**Example 1:**
\`\`\`
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], 
words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
\`\`\``,

    // Heap / Priority Queue
    'kth largest element in a stream': `**Example 1:**
\`\`\`
Input: 
["KthLargest","add","add","add","add","add"]
[[3,[4,5,8,2]],[3],[5],[10],[9],[4]]
Output: [null,4,5,5,8,8]
\`\`\``,

    'last stone weight': `**Example 1:**
\`\`\`
Input: stones = [2,7,4,1,8,1]
Output: 1
\`\`\``,

    'k closest points to origin': `**Example 1:**
\`\`\`
Input: points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
\`\`\``,

    'kth largest element in an array': `**Example 1:**
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\``,

    'task scheduler': `**Example 1:**
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
\`\`\``,

    'design twitter': `**Example 1:**
\`\`\`
Input: 
["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"]
[[],[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]
Output: [null,null,[5],null,null,[6,5],null,[5]]
\`\`\``,

    'find median from data stream': `**Example 1:**
\`\`\`
Input:
["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
[[],[1],[2],[],[3],[]]
Output: [null,null,null,1.5,null,2.0]
\`\`\``,

    // Backtracking
    'subsets': `**Example 1:**
\`\`\`
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
\`\`\``,

    'combination sum': `**Example 1:**
\`\`\`
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
\`\`\``,

    'permutations': `**Example 1:**
\`\`\`
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
\`\`\``,

    'subsets ii': `**Example 1:**
\`\`\`
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
\`\`\``,

    'combination sum ii': `**Example 1:**
\`\`\`
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
\`\`\``,

    'word search': `**Example 1:**
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
\`\`\``,

    'palindrome partitioning': `**Example 1:**
\`\`\`
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]
\`\`\``,

    'letter combinations of a phone number': `**Example 1:**
\`\`\`
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
\`\`\``,

    'n-queens': `**Example 1:**
\`\`\`
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
\`\`\``,

    // Graphs
    'number of islands': `**Example 1:**
\`\`\`
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
\`\`\`

**Example 2:**
\`\`\`
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
\`\`\``,

    'clone graph': `**Example 1:**
\`\`\`
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: Deep copy of the graph
\`\`\``,

    'max area of island': `**Example 1:**
\`\`\`
Input: grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]
Output: 6
\`\`\``,

    'pacific atlantic water flow': `**Example 1:**
\`\`\`
Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
\`\`\``,

    'surrounded regions': `**Example 1:**
\`\`\`
Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
\`\`\``,

    'rotting oranges': `**Example 1:**
\`\`\`
Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
\`\`\``,

    'walls and gates': `**Example 1:**
\`\`\`
Input: rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]
Output: [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]
\`\`\``,

    'course schedule': `**Example 1:**
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
\`\`\``,

    'course schedule ii': `**Example 1:**
\`\`\`
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,2,1,3]
\`\`\``,

    'redundant connection': `**Example 1:**
\`\`\`
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
\`\`\``,

    'number of connected components': `**Example 1:**
\`\`\`
Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
\`\`\``,

    'graph valid tree': `**Example 1:**
\`\`\`
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true
\`\`\``,

    'word ladder': `**Example 1:**
\`\`\`
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
\`\`\``,

    // Advanced Graphs
    'reconstruct itinerary': `**Example 1:**
\`\`\`
Input: tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
Output: ["JFK","MUC","LHR","SFO","SJC"]
\`\`\``,

    'min cost to connect all points': `**Example 1:**
\`\`\`
Input: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
Output: 20
\`\`\``,

    'network delay time': `**Example 1:**
\`\`\`
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
\`\`\``,

    'swim in rising water': `**Example 1:**
\`\`\`
Input: grid = [[0,2],[1,3]]
Output: 3
\`\`\``,

    'alien dictionary': `**Example 1:**
\`\`\`
Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"
\`\`\``,

    'cheapest flights within k stops': `**Example 1:**
\`\`\`
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
Output: 700
\`\`\``,

    // 1D DP
    'climbing stairs': `**Example 1:**
\`\`\`
Input: n = 2
Output: 2
Explanation: 1+1 or 2
\`\`\`

**Example 2:**
\`\`\`
Input: n = 3
Output: 3
Explanation: 1+1+1, 1+2, 2+1
\`\`\`

**Example 3:**
\`\`\`
Input: n = 4
Output: 5
\`\`\``,

    'min cost climbing stairs': `**Example 1:**
\`\`\`
Input: cost = [10,15,20]
Output: 15
\`\`\``,

    'house robber': `**Example 1:**
\`\`\`
Input: nums = [1,2,3,1]
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [2,7,9,3,1]
Output: 12
\`\`\``,

    'house robber ii': `**Example 1:**
\`\`\`
Input: nums = [2,3,2]
Output: 3
\`\`\``,

    'longest palindromic substring': `**Example 1:**
\`\`\`
Input: s = "babad"
Output: "bab" or "aba"
\`\`\``,

    'palindromic substrings': `**Example 1:**
\`\`\`
Input: s = "abc"
Output: 3
\`\`\``,

    'decode ways': `**Example 1:**
\`\`\`
Input: s = "12"
Output: 2
\`\`\``,

    'coin change': `**Example 1:**
\`\`\`
Input: coins = [1,2,5], amount = 11
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: coins = [2], amount = 3
Output: -1
\`\`\``,

    'maximum product subarray': `**Example 1:**
\`\`\`
Input: nums = [2,3,-2,4]
Output: 6
\`\`\``,

    'word break': `**Example 1:**
\`\`\`
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
\`\`\``,

    'longest increasing subsequence': `**Example 1:**
\`\`\`
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
\`\`\``,

    'partition equal subset sum': `**Example 1:**
\`\`\`
Input: nums = [1,5,11,5]
Output: true
\`\`\``,

    // 2D DP
    'unique paths': `**Example 1:**
\`\`\`
Input: m = 3, n = 7
Output: 28
\`\`\``,

    'longest common subsequence': `**Example 1:**
\`\`\`
Input: text1 = "abcde", text2 = "ace"
Output: 3
\`\`\``,

    'best time to buy and sell stock with cooldown': `**Example 1:**
\`\`\`
Input: prices = [1,2,3,0,2]
Output: 3
\`\`\``,

    'coin change ii': `**Example 1:**
\`\`\`
Input: amount = 5, coins = [1,2,5]
Output: 4
\`\`\``,

    'target sum': `**Example 1:**
\`\`\`
Input: nums = [1,1,1,1,1], target = 3
Output: 5
\`\`\``,

    'interleaving string': `**Example 1:**
\`\`\`
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
\`\`\``,

    'longest increasing path in a matrix': `**Example 1:**
\`\`\`
Input: matrix = [[9,9,4],[6,6,8],[2,1,1]]
Output: 4
\`\`\``,

    'distinct subsequences': `**Example 1:**
\`\`\`
Input: s = "rabbbit", t = "rabbit"
Output: 3
\`\`\``,

    'edit distance': `**Example 1:**
\`\`\`
Input: word1 = "horse", word2 = "ros"
Output: 3
\`\`\``,

    'burst balloons': `**Example 1:**
\`\`\`
Input: nums = [3,1,5,8]
Output: 167
\`\`\``,

    'regular expression matching': `**Example 1:**
\`\`\`
Input: s = "aa", p = "a"
Output: false
\`\`\``,

    // Greedy
    'maximum subarray': `**Example 1:**
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
\`\`\``,

    'jump game': `**Example 1:**
\`\`\`
Input: nums = [2,3,1,1,4]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,1,0,4]
Output: false
\`\`\``,

    'jump game ii': `**Example 1:**
\`\`\`
Input: nums = [2,3,1,1,4]
Output: 2
\`\`\``,

    'gas station': `**Example 1:**
\`\`\`
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
\`\`\``,

    'hand of straights': `**Example 1:**
\`\`\`
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
\`\`\``,

    'merge intervals': `**Example 1:**
\`\`\`
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
\`\`\``,

    'insert interval': `**Example 1:**
\`\`\`
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
\`\`\``,

    'minimum number of arrows to burst balloons': `**Example 1:**
\`\`\`
Input: points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
\`\`\``,

    // Intervals
    'non-overlapping intervals': `**Example 1:**
\`\`\`
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
\`\`\``,

    'meeting rooms': `**Example 1:**
\`\`\`
Input: intervals = [[0,30],[5,10],[15,20]]
Output: false
\`\`\``,

    'meeting rooms ii': `**Example 1:**
\`\`\`
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2
\`\`\``,

    // Math & Geometry
    'rotate image': `**Example 1:**
\`\`\`
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
\`\`\``,

    'spiral matrix': `**Example 1:**
\`\`\`
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
\`\`\``,

    'set matrix zeroes': `**Example 1:**
\`\`\`
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
\`\`\``,

    'happy number': `**Example 1:**
\`\`\`
Input: n = 19
Output: true
Explanation: 1²+9²=82, 8²+2²=68, 6²+8²=100, 1²+0²+0²=1
\`\`\``,

    'plus one': `**Example 1:**
\`\`\`
Input: digits = [1,2,3]
Output: [1,2,4]
\`\`\`

**Example 2:**
\`\`\`
Input: digits = [9,9,9]
Output: [1,0,0,0]
\`\`\``,

    'pow(x, n)': `**Example 1:**
\`\`\`
Input: x = 2.00000, n = 10
Output: 1024.00000
\`\`\``,

    'multiply strings': `**Example 1:**
\`\`\`
Input: num1 = "2", num2 = "3"
Output: "6"
\`\`\``,

    'detect squares': `**Example 1:**
\`\`\`
Input: ["DetectSquares","add","add","add","count","count","add","count"]
[[],[[3,10]],[[11,2]],[[3,2]],[[11,10]],[[14,8]],[[11,2]],[[11,10]]]
Output: [null,null,null,null,1,0,null,2]
\`\`\``,

    // Bit Manipulation
    'single number': `**Example 1:**
\`\`\`
Input: nums = [2,2,1]
Output: 1
\`\`\``,

    'number of 1 bits': `**Example 1:**
\`\`\`
Input: n = 11 (1011)
Output: 3
\`\`\``,

    'counting bits': `**Example 1:**
\`\`\`
Input: n = 2
Output: [0,1,1]
\`\`\``,

    'reverse bits': `**Example 1:**
\`\`\`
Input: n = 43261596 (00000010100101000001111010011100)
Output: 964176192 (00111001011110000010100101000000)
\`\`\``,

    'missing number': `**Example 1:**
\`\`\`
Input: nums = [3,0,1]
Output: 2
\`\`\``,

    'sum of two integers': `**Example 1:**
\`\`\`
Input: a = 1, b = 2
Output: 3
\`\`\``,

    'reverse integer': `**Example 1:**
\`\`\`
Input: x = 123
Output: 321
\`\`\``
  };

  // Return matching examples or default
  for (const [key, example] of Object.entries(examples)) {
    if (t.includes(key)) {
      return example;
    }
  }

  // Default examples template for any unmatched problem
  return `**Example 1:**
\`\`\`
Input: Standard test case
Output: Expected output
Explanation: Brief explanation of the solution approach
\`\`\`

**Example 2:**
\`\`\`
Input: Edge case
Output: Expected output
\`\`\`

**Example 3:**
\`\`\`
Input: Maximum constraints case
Output: Expected output
\`\`\`

**Constraints:**
- Follow the problem constraints as specified
- Handle edge cases appropriately`;
}

// ── Enhanced Test Cases Generator for ALL Problems ────────────────────────────
function generateTestCases(title: string, difficulty: string): any[] {
  const t = title.toLowerCase();

  // Arrays & Hashing
  if (t.includes('contains duplicate')) {
    return [
      { input: { nums: [1,2,3,1] }, expected: true, description: 'Has duplicate' },
      { input: { nums: [1,2,3,4] }, expected: false, description: 'No duplicates' },
      { input: { nums: [1,1,1,1] }, expected: true, description: 'All duplicates' },
      { input: { nums: [] }, expected: false, description: 'Empty array' },
      { input: { nums: [1] }, expected: false, description: 'Single element' }
    ];
  }
  
  if (t.includes('valid anagram')) {
    return [
      { input: { s: "anagram", t: "nagaram" }, expected: true, description: 'Valid anagram' },
      { input: { s: "rat", t: "car" }, expected: false, description: 'Invalid anagram' },
      { input: { s: "", t: "" }, expected: true, description: 'Empty strings' },
      { input: { s: "a", t: "a" }, expected: true, description: 'Single character' },
      { input: { s: "ab", t: "a" }, expected: false, description: 'Different lengths' }
    ];
  }
  
  if (t.includes('two sum')) {
    return [
      { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1], description: 'Basic case' },
      { input: { nums: [3,2,4], target: 6 }, expected: [1,2], description: 'Non-consecutive' },
      { input: { nums: [3,3], target: 6 }, expected: [0,1], description: 'Duplicate numbers' },
      { input: { nums: [1,2,3,4,5], target: 9 }, expected: [3,4], description: 'End elements' },
      { input: { nums: [-1,-2,-3,-4,-5], target: -8 }, expected: [2,4], description: 'Negative numbers' }
    ];
  }
  
  if (t.includes('group anagrams')) {
    return [
      { input: { strs: ["eat","tea","tan","ate","nat","bat"] }, expected: [["bat"],["nat","tan"],["ate","eat","tea"]], description: 'Multiple groups' },
      { input: { strs: [""] }, expected: [[""]], description: 'Empty string' },
      { input: { strs: ["a"] }, expected: [["a"]], description: 'Single character' }
    ];
  }
  
  if (t.includes('top k frequent')) {
    return [
      { input: { nums: [1,1,1,2,2,3], k: 2 }, expected: [1,2], description: 'Basic case' },
      { input: { nums: [1], k: 1 }, expected: [1], description: 'Single element' },
      { input: { nums: [1,2,3,4,5], k: 3 }, expected: [1,2,3], description: 'All unique' }
    ];
  }
  
  if (t.includes('product of array except self')) {
    return [
      { input: { nums: [1,2,3,4] }, expected: [24,12,8,6], description: 'Basic case' },
      { input: { nums: [-1,1,0,-3,3] }, expected: [0,0,9,0,0], description: 'Contains zero' },
      { input: { nums: [2,2,2] }, expected: [4,4,4], description: 'All same numbers' }
    ];
  }

  // Two Pointers
  if (t.includes('valid palindrome')) {
    return [
      { input: { s: "A man, a plan, a canal: Panama" }, expected: true, description: 'With punctuation' },
      { input: { s: "race a car" }, expected: false, description: 'Not palindrome' },
      { input: { s: " " }, expected: true, description: 'Empty string' },
      { input: { s: "a" }, expected: true, description: 'Single character' }
    ];
  }
  
  if (t.includes('3sum')) {
    return [
      { input: { nums: [-1,0,1,2,-1,-4] }, expected: [[-1,-1,2],[-1,0,1]], description: 'Multiple triplets' },
      { input: { nums: [0,1,1] }, expected: [], description: 'No triplets' },
      { input: { nums: [0,0,0] }, expected: [[0,0,0]], description: 'All zeros' }
    ];
  }

  // Sliding Window
  if (t.includes('best time to buy and sell stock')) {
    return [
      { input: { prices: [7,1,5,3,6,4] }, expected: 5, description: 'Buy at 1, sell at 6' },
      { input: { prices: [7,6,4,3,1] }, expected: 0, description: 'No profit possible' },
      { input: { prices: [1] }, expected: 0, description: 'Single day' }
    ];
  }
  
  if (t.includes('longest substring without repeating')) {
    return [
      { input: { s: "abcabcbb" }, expected: 3, description: 'Basic case' },
      { input: { s: "bbbbb" }, expected: 1, description: 'All same characters' },
      { input: { s: "pwwkew" }, expected: 3, description: 'Mixed' },
      { input: { s: "" }, expected: 0, description: 'Empty string' }
    ];
  }

  // Dynamic Programming
  if (t.includes('climbing stairs')) {
    return [
      { input: { n: 1 }, expected: 1, description: 'Base case: n=1' },
      { input: { n: 2 }, expected: 2, description: 'Base case: n=2' },
      { input: { n: 3 }, expected: 3, description: 'Edge case: n=3' },
      { input: { n: 5 }, expected: 8, description: 'Normal case: n=5' },
      { input: { n: 45 }, expected: 1836311903, description: 'Maximum constraint' }
    ];
  }
  
  if (t.includes('house robber')) {
    return [
      { input: { nums: [1,2,3,1] }, expected: 4, description: 'Rob houses 1 and 3' },
      { input: { nums: [2,7,9,3,1] }, expected: 12, description: 'Rob houses 1,3,5' },
      { input: { nums: [1] }, expected: 1, description: 'Single house' },
      { input: { nums: [2,1,1,2] }, expected: 4, description: 'Alternating pattern' }
    ];
  }
  
  if (t.includes('coin change')) {
    return [
      { input: { coins: [1,2,5], amount: 11 }, expected: 3, description: '5+5+1' },
      { input: { coins: [2], amount: 3 }, expected: -1, description: 'Not possible' },
      { input: { coins: [1], amount: 0 }, expected: 0, description: 'Amount 0' },
      { input: { coins: [1,3,4], amount: 6 }, expected: 2, description: '3+3' }
    ];
  }

  // Graphs
  if (t.includes('number of islands')) {
    return [
      { input: { grid: [['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']] }, expected: 1, description: 'One island' },
      { input: { grid: [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']] }, expected: 3, description: 'Three islands' },
      { input: { grid: [['0','0','0'],['0','0','0']] }, expected: 0, description: 'No islands' },
      { input: { grid: [['1']] }, expected: 1, description: 'Single cell' }
    ];
  }

  // Trees
  if (t.includes('maximum depth of binary tree')) {
    return [
      { input: { root: [3,9,20,null,null,15,7] }, expected: 3, description: 'Normal tree' },
      { input: { root: [1,null,2] }, expected: 2, description: 'Skewed tree' },
      { input: { root: [] }, expected: 0, description: 'Empty tree' },
      { input: { root: [1] }, expected: 1, description: 'Single node' }
    ];
  }
  
  if (t.includes('invert binary tree')) {
    return [
      { input: { root: [4,2,7,1,3,6,9] }, expected: [4,7,2,9,6,3,1], description: 'Full tree' },
      { input: { root: [2,1,3] }, expected: [2,3,1], description: 'Small tree' },
      { input: { root: [] }, expected: [], description: 'Empty tree' }
    ];
  }

  // Backtracking
  if (t.includes('subsets')) {
    return [
      { input: { nums: [1,2,3] }, expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]], description: 'All subsets' },
      { input: { nums: [0] }, expected: [[],[0]], description: 'Single element' },
      { input: { nums: [] }, expected: [[]], description: 'Empty array' }
    ];
  }
  
  if (t.includes('permutations')) {
    return [
      { input: { nums: [1,2,3] }, expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]], description: 'All permutations' },
      { input: { nums: [0,1] }, expected: [[0,1],[1,0]], description: 'Two elements' },
      { input: { nums: [1] }, expected: [[1]], description: 'Single element' }
    ];
  }

  // Greedy
  if (t.includes('maximum subarray')) {
    return [
      { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expected: 6, description: 'Mixed numbers' },
      { input: { nums: [1] }, expected: 1, description: 'Single element' },
      { input: { nums: [5,4,-1,7,8] }, expected: 23, description: 'All positive' },
      { input: { nums: [-1,-2,-3] }, expected: -1, description: 'All negative' }
    ];
  }
  
  if (t.includes('jump game')) {
    return [
      { input: { nums: [2,3,1,1,4] }, expected: true, description: 'Possible to reach end' },
      { input: { nums: [3,2,1,0,4] }, expected: false, description: 'Cannot reach end' },
      { input: { nums: [0] }, expected: true, description: 'Single element' }
    ];
  }

  // Intervals
  if (t.includes('merge intervals')) {
    return [
      { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expected: [[1,6],[8,10],[15,18]], description: 'Overlapping intervals' },
      { input: { intervals: [[1,4],[4,5]] }, expected: [[1,5]], description: 'Adjacent intervals' },
      { input: { intervals: [[1,4],[2,3]] }, expected: [[1,4]], description: 'Nested intervals' }
    ];
  }

  // Math & Geometry
  if (t.includes('plus one')) {
    return [
      { input: { digits: [1,2,3] }, expected: [1,2,4], description: 'Normal case' },
      { input: { digits: [9] }, expected: [1,0], description: 'Single 9' },
      { input: { digits: [9,9,9] }, expected: [1,0,0,0], description: 'All 9s' },
      { input: { digits: [0] }, expected: [1], description: 'Single 0' }
    ];
  }

  // Bit Manipulation
  if (t.includes('single number')) {
    return [
      { input: { nums: [2,2,1] }, expected: 1, description: 'Basic case' },
      { input: { nums: [4,1,2,1,2] }, expected: 4, description: 'Multiple pairs' },
      { input: { nums: [1] }, expected: 1, description: 'Single element' }
    ];
  }

  // Default test cases based on difficulty
  const defaults: Record<string, any[]> = {
    easy: [
      { input: { input: 1 }, expected: 1, description: 'Edge case: minimum input' },
      { input: { input: 0 }, expected: 0, description: 'Edge case: zero' },
      { input: { input: 5 }, expected: 5, description: 'Normal case' },
      { input: { input: 100 }, expected: 100, description: 'Larger number' }
    ],
    medium: [
      { input: { input: 1 }, expected: 1, description: 'Minimum input' },
      { input: { input: 5 }, expected: 5, description: 'Small input' },
      { input: { input: 10 }, expected: 10, description: 'Medium input' },
      { input: { input: 0 }, expected: 0, description: 'Zero case' }
    ],
    hard: [
      { input: { input: 1 }, expected: 1, description: 'Base case' },
      { input: { input: 10 }, expected: 10, description: 'Medium case' },
      { input: { input: 100 }, expected: 100, description: 'Large case' },
      { input: { input: 0 }, expected: 0, description: 'Edge case' }
    ],
  };
  
  return defaults[difficulty.toLowerCase()] ?? defaults.medium;
}

// ── Starter code for ALL 150 problems ────────────────────────────────────────
function getStarterCode(title: string): Record<string, string> {
  const t = title.toLowerCase();

  // Helper to build starter for simple int→int problems
  const simple = (fn: string, params: string, desc: string) => ({
    python:     `def ${fn}(${params}):\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public int ${fn}(${params.split(',').map(p=>`int ${p.trim()}`).join(', ')}) {\n        // ${desc}\n        return 0;\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    int ${fn}(${params.split(',').map(p=>`int ${p.trim()}`).join(', ')}) {\n        // ${desc}\n        return 0;\n    }\n};`,
    typescript: `function ${fn}(${params.split(',').map(p=>`${p.trim()}: number`).join(', ')}): number {\n    // ${desc}\n    return 0;\n}`,
  });

  const arr = (fn: string, params: string, desc: string, retPy='List[int]', retTs='number[]', retJava='int[]', retCpp='vector<int>') => ({
    python:     `from typing import List\ndef ${fn}(${params}) -> ${retPy}:\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public ${retJava} ${fn}(${params}) {\n        // ${desc}\n        return new int[]{};\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    ${retCpp} ${fn}(${params}) {\n        // ${desc}\n        return {};\n    }\n};`,
    typescript: `function ${fn}(${params}): ${retTs} {\n    // ${desc}\n    return [];\n}`,
  });

  const bool = (fn: string, params: string, desc: string) => ({
    python:     `def ${fn}(${params}) -> bool:\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public boolean ${fn}(${params}) {\n        // ${desc}\n        return false;\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    bool ${fn}(${params}) {\n        // ${desc}\n        return false;\n    }\n};`,
    typescript: `function ${fn}(${params}): boolean {\n    // ${desc}\n    return false;\n}`,
  });

  const str = (fn: string, params: string, desc: string) => ({
    python:     `def ${fn}(${params}) -> str:\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public String ${fn}(${params}) {\n        // ${desc}\n        return "";\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    string ${fn}(${params}) {\n        // ${desc}\n        return "";\n    }\n};`,
    typescript: `function ${fn}(${params}): string {\n    // ${desc}\n    return "";\n}`,
  });

  // Arrays & Hashing
  if (t.includes('contains duplicate'))
    return bool('containsDuplicate', 'nums: List[int]', 'Return true if any value appears at least twice');
  if (t.includes('valid anagram'))
    return bool('isAnagram', 's: str, t: str', 'Return true if t is an anagram of s');
  if (t.includes('two sum'))
    return arr('twoSum', 'nums: List[int], target: int', 'Return indices of two numbers that add up to target');
  if (t.includes('group anagrams'))
    return ({
      python: `from typing import List\ndef groupAnagrams(strs: List[str]) -> List[List[str]]:\n    # Group strings that are anagrams of each other\n    pass`,
      javascript: `function groupAnagrams(strs) {\n    // Group strings that are anagrams\n}`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Group strings that are anagrams\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Group strings that are anagrams\n        return {};\n    }\n};`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {\n    // Group strings that are anagrams\n    return [];\n}`,
    });
  if (t.includes('top k frequent'))
    return arr('topKFrequent', 'nums: List[int], k: int', 'Return k most frequent elements');
  if (t.includes('product of array except self'))
    return arr('productExceptSelf', 'nums: List[int]', 'Return array where each element is product of all others');
  if (t.includes('valid sudoku'))
    return bool('isValidSudoku', 'board: List[List[str]]', 'Determine if a 9x9 Sudoku board is valid');
  if (t.includes('encode and decode'))
    return ({
      python: `class Codec:\n    def encode(self, strs: List[str]) -> str:\n        # Encode list of strings to a single string\n        pass\n    def decode(self, s: str) -> List[str]:\n        # Decode single string back to list of strings\n        pass`,
      javascript: `function encode(strs) {\n    // Encode list of strings\n}\nfunction decode(s) {\n    // Decode string back to list\n}`,
      java: `public class Codec {\n    public String encode(List<String> strs) {\n        return "";\n    }\n    public List<String> decode(String s) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Codec {\npublic:\n    string encode(vector<string> strs) {\n        return "";\n    }\n    vector<string> decode(string s) {\n        return {};\n    }\n};`,
      typescript: `function encode(strs: string[]): string {\n    return "";\n}\nfunction decode(s: string): string[] {\n    return [];\n}`,
    });
  if (t.includes('longest consecutive'))
    return simple('longestConsecutive', 'nums', 'Return length of longest consecutive sequence');

  // Two Pointers
  if (t.includes('valid palindrome'))
    return bool('isPalindrome', 's: str', 'Return true if s is a palindrome');
  if (t.includes('two sum ii'))
    return arr('twoSum', 'numbers: List[int], target: int', 'Return 1-indexed positions of two numbers that add to target');
  if (t.includes('3sum'))
    return ({
      python: `from typing import List\ndef threeSum(nums: List[int]) -> List[List[int]]:\n    # Find all unique triplets that sum to zero\n    pass`,
      javascript: `function threeSum(nums) {\n    // Find all unique triplets that sum to zero\n}`,
      java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        return {};\n    }\n};`,
      typescript: `function threeSum(nums: number[]): number[][] {\n    return [];\n}`,
    });
  if (t.includes('container with most water'))
    return simple('maxArea', 'height', 'Return max water container can store');
  if (t.includes('trapping rain water'))
    return simple('trap', 'height', 'Return total water trapped after raining');

  // Sliding Window
  if (t.includes('best time to buy and sell stock') && !t.includes('cooldown') && !t.includes('ii'))
    return simple('maxProfit', 'prices', 'Return maximum profit from one buy/sell transaction');
  if (t.includes('longest substring without repeating'))
    return simple('lengthOfLongestSubstring', 's', 'Return length of longest substring without repeating characters');
  if (t.includes('longest repeating character replacement'))
    return simple('characterReplacement', 's, k', 'Return length of longest substring with same letters after k replacements');
  if (t.includes('permutation in string'))
    return bool('checkInclusion', 's1: str, s2: str', 'Return true if s2 contains a permutation of s1');
  if (t.includes('minimum window substring'))
    return str('minWindow', 's: str, t: str', 'Return minimum window substring containing all chars of t');
  if (t.includes('sliding window maximum'))
    return arr('maxSlidingWindow', 'nums: List[int], k: int', 'Return max of each sliding window of size k');

  // Stack
  if (t.includes('valid parentheses'))
    return bool('isValid', 's: str', 'Return true if parentheses string is valid');
  if (t.includes('min stack'))
    return ({
      python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def getMin(self) -> int:\n        pass`,
      javascript: `class MinStack {\n    constructor() {}\n    push(val) {}\n    pop() {}\n    top() {}\n    getMin() {}\n}`,
      java: `class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}`,
      cpp: `class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};`,
      typescript: `class MinStack {\n    constructor() {}\n    push(val: number): void {}\n    pop(): void {}\n    top(): number { return 0; }\n    getMin(): number { return 0; }\n}`,
    });
  if (t.includes('evaluate reverse polish'))
    return simple('evalRPN', 'tokens', 'Evaluate reverse polish notation expression');
  if (t.includes('generate parentheses'))
    return ({
      python: `from typing import List\ndef generateParenthesis(n: int) -> List[str]:\n    # Generate all combinations of n pairs of parentheses\n    pass`,
      javascript: `function generateParenthesis(n) {\n    // Generate all valid combinations\n}`,
      java: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        return {};\n    }\n};`,
      typescript: `function generateParenthesis(n: number): string[] {\n    return [];\n}`,
    });
  if (t.includes('daily temperatures'))
    return arr('dailyTemperatures', 'temperatures: List[int]', 'Return how many days until warmer temperature');
  if (t.includes('car fleet'))
    return simple('carFleet', 'target, position, speed', 'Return number of car fleets that arrive at destination');
  if (t.includes('largest rectangle in histogram'))
    return simple('largestRectangleArea', 'heights', 'Return area of largest rectangle in histogram');

  // Binary Search
  if (t.includes('binary search') && !t.includes('matrix'))
    return simple('search', 'nums, target', 'Return index of target in sorted array or -1');
  if (t.includes('search a 2d matrix'))
    return bool('searchMatrix', 'matrix: List[List[int]], target: int', 'Search for target in sorted 2D matrix');
  if (t.includes('koko eating bananas'))
    return simple('minEatingSpeed', 'piles, h', 'Return minimum eating speed to finish all bananas in h hours');
  if (t.includes('find minimum in rotated sorted array'))
    return simple('findMin', 'nums', 'Return minimum element in rotated sorted array');
  if (t.includes('search in rotated sorted array'))
    return simple('search', 'nums, target', 'Return index of target in rotated sorted array');
  if (t.includes('time based key-value') || t.includes('time based key'))
    return ({
      python: `class TimeMap:\n    def __init__(self):\n        pass\n    def set(self, key: str, value: str, timestamp: int) -> None:\n        pass\n    def get(self, key: str, timestamp: int) -> str:\n        pass`,
      javascript: `class TimeMap {\n    constructor() {}\n    set(key, value, timestamp) {}\n    get(key, timestamp) { return ""; }\n}`,
      java: `class TimeMap {\n    public TimeMap() {}\n    public void set(String key, String value, int timestamp) {}\n    public String get(String key, int timestamp) { return ""; }\n}`,
      cpp: `class TimeMap {\npublic:\n    TimeMap() {}\n    void set(string key, string value, int timestamp) {}\n    string get(string key, int timestamp) { return ""; }\n};`,
      typescript: `class TimeMap {\n    constructor() {}\n    set(key: string, value: string, timestamp: number): void {}\n    get(key: string, timestamp: number): string { return ""; }\n}`,
    });
  if (t.includes('median of two sorted arrays'))
    return ({
      python: `from typing import List\ndef findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:\n    # Find median of two sorted arrays\n    pass`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n    // Find median of two sorted arrays\n}`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        return 0.0;\n    }\n};`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n    return 0;\n}`,
    });

  // Linked List
  const ll = (fn: string, params: string, desc: string) => ({
    python:     `from typing import Optional\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef ${fn}(${params}) -> Optional[ListNode]:\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public ListNode ${fn}(${params}) {\n        // ${desc}\n        return null;\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    ListNode* ${fn}(${params}) {\n        // ${desc}\n        return nullptr;\n    }\n};`,
    typescript: `function ${fn}(${params}): ListNode | null {\n    // ${desc}\n    return null;\n}`,
  });
  if (t.includes('reverse linked list'))
    return ll('reverseList', 'head: Optional[ListNode]', 'Reverse a linked list');
  if (t.includes('merge two sorted lists'))
    return ll('mergeTwoLists', 'list1: Optional[ListNode], list2: Optional[ListNode]', 'Merge two sorted linked lists');
  if (t.includes('reorder list'))
    return ({
      python: `def reorderList(head: Optional[ListNode]) -> None:\n    # Reorder list in-place L0→Ln→L1→Ln-1→...\n    pass`,
      javascript: `function reorderList(head) {\n    // Reorder list in-place\n}`,
      java: `class Solution {\n    public void reorderList(ListNode head) {\n        // Reorder list in-place\n    }\n}`,
      cpp: `class Solution {\npublic:\n    void reorderList(ListNode* head) {\n        // Reorder list in-place\n    }\n};`,
      typescript: `function reorderList(head: ListNode | null): void {\n    // Reorder list in-place\n}`,
    });
  if (t.includes('remove nth node from end'))
    return ll('removeNthFromEnd', 'head: Optional[ListNode], n: int', 'Remove nth node from end of list');
  if (t.includes('copy list with random pointer'))
    return ({
      python: `def copyRandomList(head):\n    # Deep copy a linked list with random pointers\n    pass`,
      javascript: `function copyRandomList(head) {\n    // Deep copy linked list with random pointers\n}`,
      java: `class Solution {\n    public Node copyRandomList(Node head) {\n        return null;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    Node* copyRandomList(Node* head) {\n        return nullptr;\n    }\n};`,
      typescript: `function copyRandomList(head: Node | null): Node | null {\n    return null;\n}`,
    });
  if (t.includes('add two numbers'))
    return ll('addTwoNumbers', 'l1: Optional[ListNode], l2: Optional[ListNode]', 'Add two numbers represented as linked lists');
  if (t.includes('linked list cycle'))
    return bool('hasCycle', 'head', 'Return true if linked list has a cycle');
  if (t.includes('find the duplicate number'))
    return simple('findDuplicate', 'nums', 'Find duplicate number in array without modifying it');
  if (t.includes('lru cache'))
    return ({
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass`,
      javascript: `class LRUCache {\n    constructor(capacity) {}\n    get(key) { return -1; }\n    put(key, value) {}\n}`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
      typescript: `class LRUCache {\n    constructor(capacity: number) {}\n    get(key: number): number { return -1; }\n    put(key: number, value: number): void {}\n}`,
    });
  if (t.includes('merge k sorted lists'))
    return ll('mergeKLists', 'lists: List[Optional[ListNode]]', 'Merge k sorted linked lists');
  if (t.includes('reverse nodes in k-group') || t.includes('reverse nodes in k group'))
    return ll('reverseKGroup', 'head: Optional[ListNode], k: int', 'Reverse every k nodes in linked list');

  // Trees
  const tree = (fn: string, params: string, desc: string, retPy='Optional[TreeNode]', retJava='TreeNode', retCpp='TreeNode*', retTs='TreeNode | null') => ({
    python:     `from typing import Optional\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef ${fn}(${params}) -> ${retPy}:\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public ${retJava} ${fn}(${params}) {\n        return null;\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    ${retCpp} ${fn}(${params}) {\n        return nullptr;\n    }\n};`,
    typescript: `function ${fn}(${params}): ${retTs} {\n    return null;\n}`,
  });
  if (t.includes('invert binary tree'))
    return tree('invertTree', 'root: Optional[TreeNode]', 'Invert a binary tree');
  if (t.includes('maximum depth of binary tree'))
    return simple('maxDepth', 'root', 'Return maximum depth of binary tree');
  if (t.includes('diameter of binary tree'))
    return simple('diameterOfBinaryTree', 'root', 'Return diameter of binary tree');
  if (t.includes('balanced binary tree'))
    return bool('isBalanced', 'root', 'Determine if binary tree is height-balanced');
  if (t.includes('same tree'))
    return bool('isSameTree', 'p, q', 'Check if two binary trees are the same');
  if (t.includes('subtree of another tree'))
    return bool('isSubtree', 'root, subRoot', 'Check if subRoot is a subtree of root');
  if (t.includes('lowest common ancestor of a binary search tree'))
    return tree('lowestCommonAncestor', 'root, p, q', 'Find lowest common ancestor in BST');
  if (t.includes('binary tree level order traversal'))
    return ({
      python: `from typing import List, Optional\ndef levelOrder(root) -> List[List[int]]:\n    # Return level order traversal of binary tree\n    pass`,
      javascript: `function levelOrder(root) {\n    // Return level order traversal\n}`,
      java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        return {};\n    }\n};`,
      typescript: `function levelOrder(root: TreeNode | null): number[][] {\n    return [];\n}`,
    });
  if (t.includes('binary tree right side view'))
    return arr('rightSideView', 'root', 'Return values visible from right side of binary tree');
  if (t.includes('count good nodes in binary tree'))
    return simple('goodNodes', 'root', 'Count nodes where no node in path has greater value');
  if (t.includes('validate binary search tree'))
    return bool('isValidBST', 'root', 'Validate if binary tree is a valid BST');
  if (t.includes('kth smallest element in a bst') || t.includes('kth smallest element in a b'))
    return simple('kthSmallest', 'root, k', 'Return kth smallest element in BST');
  if (t.includes('construct binary tree from preorder and inorder'))
    return tree('buildTree', 'preorder: List[int], inorder: List[int]', 'Construct binary tree from preorder and inorder traversal');
  if (t.includes('binary tree maximum path sum'))
    return simple('maxPathSum', 'root', 'Return maximum path sum in binary tree');
  if (t.includes('serialize and deserialize binary tree'))
    return ({
      python: `class Codec:\n    def serialize(self, root) -> str:\n        # Serialize binary tree to string\n        pass\n    def deserialize(self, data: str):\n        # Deserialize string back to binary tree\n        pass`,
      javascript: `function serialize(root) {\n    // Serialize tree to string\n}\nfunction deserialize(data) {\n    // Deserialize string to tree\n}`,
      java: `public class Codec {\n    public String serialize(TreeNode root) {\n        return "";\n    }\n    public TreeNode deserialize(String data) {\n        return null;\n    }\n}`,
      cpp: `class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        return "";\n    }\n    TreeNode* deserialize(string data) {\n        return nullptr;\n    }\n};`,
      typescript: `function serialize(root: TreeNode | null): string {\n    return "";\n}\nfunction deserialize(data: string): TreeNode | null {\n    return null;\n}`,
    });

  // Tries
  if (t.includes('implement trie') || t.includes('prefix tree'))
    return ({
      python: `class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass\n    def startsWith(self, prefix: str) -> bool:\n        pass`,
      javascript: `class Trie {\n    constructor() {}\n    insert(word) {}\n    search(word) { return false; }\n    startsWith(prefix) { return false; }\n}`,
      java: `class Trie {\n    public Trie() {}\n    public void insert(String word) {}\n    public boolean search(String word) { return false; }\n    public boolean startsWith(String prefix) { return false; }\n}`,
      cpp: `class Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) { return false; }\n    bool startsWith(string prefix) { return false; }\n};`,
      typescript: `class Trie {\n    constructor() {}\n    insert(word: string): void {}\n    search(word: string): boolean { return false; }\n    startsWith(prefix: string): boolean { return false; }\n}`,
    });
  if (t.includes('design add and search words') || t.includes('add and search words'))
    return ({
      python: `class WordDictionary:\n    def __init__(self):\n        pass\n    def addWord(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass`,
      javascript: `class WordDictionary {\n    constructor() {}\n    addWord(word) {}\n    search(word) { return false; }\n}`,
      java: `class WordDictionary {\n    public WordDictionary() {}\n    public void addWord(String word) {}\n    public boolean search(String word) { return false; }\n}`,
      cpp: `class WordDictionary {\npublic:\n    WordDictionary() {}\n    void addWord(string word) {}\n    bool search(string word) { return false; }\n};`,
      typescript: `class WordDictionary {\n    constructor() {}\n    addWord(word: string): void {}\n    search(word: string): boolean { return false; }\n}`,
    });
  if (t.includes('word search ii'))
    return arr('findWords', 'board: List[List[str]], words: List[str]', 'Find all words from list that exist in board', 'List[str]', 'string[]', 'List<String>', 'vector<string>');

  // Heap / Priority Queue
  if (t.includes('kth largest element in a stream'))
    return ({
      python: `class KthLargest:\n    def __init__(self, k: int, nums: List[int]):\n        pass\n    def add(self, val: int) -> int:\n        pass`,
      javascript: `class KthLargest {\n    constructor(k, nums) {}\n    add(val) { return 0; }\n}`,
      java: `class KthLargest {\n    public KthLargest(int k, int[] nums) {}\n    public int add(int val) { return 0; }\n}`,
      cpp: `class KthLargest {\npublic:\n    KthLargest(int k, vector<int>& nums) {}\n    int add(int val) { return 0; }\n};`,
      typescript: `class KthLargest {\n    constructor(k: number, nums: number[]) {}\n    add(val: number): number { return 0; }\n}`,
    });
  if (t.includes('last stone weight'))
    return simple('lastStoneWeight', 'stones', 'Simulate smashing stones and return last stone weight');
  if (t.includes('k closest points to origin'))
    return arr('kClosest', 'points: List[List[int]], k: int', 'Return k closest points to origin', 'List[List[int]]', 'number[][]', 'int[][]', 'vector<vector<int>>');
  if (t.includes('kth largest element in an array'))
    return simple('findKthLargest', 'nums, k', 'Return kth largest element in array');
  if (t.includes('task scheduler'))
    return simple('leastInterval', 'tasks, n', 'Return minimum intervals needed to execute all tasks');
  if (t.includes('design twitter'))
    return ({
      python: `class Twitter:\n    def __init__(self):\n        pass\n    def postTweet(self, userId: int, tweetId: int) -> None:\n        pass\n    def getNewsFeed(self, userId: int) -> List[int]:\n        pass\n    def follow(self, followerId: int, followeeId: int) -> None:\n        pass\n    def unfollow(self, followerId: int, followeeId: int) -> None:\n        pass`,
      javascript: `class Twitter {\n    constructor() {}\n    postTweet(userId, tweetId) {}\n    getNewsFeed(userId) { return []; }\n    follow(followerId, followeeId) {}\n    unfollow(followerId, followeeId) {}\n}`,
      java: `class Twitter {\n    public Twitter() {}\n    public void postTweet(int userId, int tweetId) {}\n    public List<Integer> getNewsFeed(int userId) { return new ArrayList<>(); }\n    public void follow(int followerId, int followeeId) {}\n    public void unfollow(int followerId, int followeeId) {}\n}`,
      cpp: `class Twitter {\npublic:\n    Twitter() {}\n    void postTweet(int userId, int tweetId) {}\n    vector<int> getNewsFeed(int userId) { return {}; }\n    void follow(int followerId, int followeeId) {}\n    void unfollow(int followerId, int followeeId) {}\n};`,
      typescript: `class Twitter {\n    constructor() {}\n    postTweet(userId: number, tweetId: number): void {}\n    getNewsFeed(userId: number): number[] { return []; }\n    follow(followerId: number, followeeId: number): void {}\n    unfollow(followerId: number, followeeId: number): void {}\n}`,
    });
  if (t.includes('find median from data stream'))
    return ({
      python: `class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        pass`,
      javascript: `class MedianFinder {\n    constructor() {}\n    addNum(num) {}\n    findMedian() { return 0.0; }\n}`,
      java: `class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() { return 0.0; }\n}`,
      cpp: `class MedianFinder {\npublic:\n    MedianFinder() {}\n    void addNum(int num) {}\n    double findMedian() { return 0.0; }\n};`,
      typescript: `class MedianFinder {\n    constructor() {}\n    addNum(num: number): void {}\n    findMedian(): number { return 0; }\n}`,
    });

  // Backtracking
  const bt = (fn: string, params: string, desc: string) => ({
    python:     `from typing import List\ndef ${fn}(${params}) -> List[List[int]]:\n    # ${desc}\n    pass`,
    javascript: `function ${fn}(${params}) {\n    // ${desc}\n}`,
    java:       `class Solution {\n    public List<List<Integer>> ${fn}(${params}) {\n        return new ArrayList<>();\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    vector<vector<int>> ${fn}(${params}) {\n        return {};\n    }\n};`,
    typescript: `function ${fn}(${params}): number[][] {\n    return [];\n}`,
  });
  if (t.includes('subsets') && !t.includes('ii'))
    return bt('subsets', 'nums: List[int]', 'Return all possible subsets');
  if (t.includes('combination sum') && !t.includes('ii'))
    return bt('combinationSum', 'candidates: List[int], target: int', 'Return all combinations that sum to target');
  if (t.includes('permutations') && !t.includes('ii'))
    return bt('permute', 'nums: List[int]', 'Return all permutations of nums');
  if (t.includes('subsets ii'))
    return bt('subsetsWithDup', 'nums: List[int]', 'Return all subsets (no duplicate subsets)');
  if (t.includes('combination sum ii'))
    return bt('combinationSum2', 'candidates: List[int], target: int', 'Return combinations summing to target (no duplicate combinations)');
  if (t.includes('word search') && !t.includes('ii'))
    return bool('exist', 'board: List[List[str]], word: str', 'Return true if word exists in board');
  if (t.includes('palindrome partitioning'))
    return ({
      python: `from typing import List\ndef partition(s: str) -> List[List[str]]:\n    # Return all palindrome partitionings of s\n    pass`,
      javascript: `function partition(s) {\n    // Return all palindrome partitionings\n}`,
      java: `class Solution {\n    public List<List<String>> partition(String s) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> partition(string s) {\n        return {};\n    }\n};`,
      typescript: `function partition(s: string): string[][] {\n    return [];\n}`,
    });
  if (t.includes('letter combinations of a phone number'))
    return ({
      python: `from typing import List\ndef letterCombinations(digits: str) -> List[str]:\n    # Return all possible letter combinations for phone digits\n    pass`,
      javascript: `function letterCombinations(digits) {\n    // Return all letter combinations\n}`,
      java: `class Solution {\n    public List<String> letterCombinations(String digits) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<string> letterCombinations(string digits) {\n        return {};\n    }\n};`,
      typescript: `function letterCombinations(digits: string): string[] {\n    return [];\n}`,
    });
  if (t.includes('n-queens') || t.includes('n queens'))
    return ({
      python: `from typing import List\ndef solveNQueens(n: int) -> List[List[str]]:\n    # Return all distinct solutions to the N-Queens puzzle\n    pass`,
      javascript: `function solveNQueens(n) {\n    // Return all solutions to N-Queens\n}`,
      java: `class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        return {};\n    }\n};`,
      typescript: `function solveNQueens(n: number): string[][] {\n    return [];\n}`,
    });

  // Graphs
  if (t.includes('number of islands'))
    return simple('numIslands', 'grid', 'Return number of islands in grid');
  if (t.includes('clone graph'))
    return ({
      python: `def cloneGraph(node):\n    # Deep clone a graph\n    pass`,
      javascript: `function cloneGraph(node) {\n    // Deep clone a graph\n}`,
      java: `class Solution {\n    public Node cloneGraph(Node node) {\n        return null;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        return nullptr;\n    }\n};`,
      typescript: `function cloneGraph(node: Node | null): Node | null {\n    return null;\n}`,
    });
  if (t.includes('max area of island'))
    return simple('maxAreaOfIsland', 'grid', 'Return maximum area of an island in grid');
  if (t.includes('pacific atlantic water flow'))
    return arr('pacificAtlantic', 'heights: List[List[int]]', 'Return coordinates where water can flow to both oceans', 'List[List[int]]', 'number[][]', 'List<List<Integer>>', 'vector<vector<int>>');
  if (t.includes('surrounded regions'))
    return ({
      python: `from typing import List\ndef solve(board: List[List[str]]) -> None:\n    # Capture surrounded regions in-place\n    pass`,
      javascript: `function solve(board) {\n    // Capture surrounded regions in-place\n}`,
      java: `class Solution {\n    public void solve(char[][] board) {\n        // Capture surrounded regions\n    }\n}`,
      cpp: `class Solution {\npublic:\n    void solve(vector<vector<char>>& board) {\n        // Capture surrounded regions\n    }\n};`,
      typescript: `function solve(board: string[][]): void {\n    // Capture surrounded regions\n}`,
    });
  if (t.includes('rotting oranges'))
    return simple('orangesRotting', 'grid', 'Return minimum minutes until no fresh oranges remain');
  if (t.includes('walls and gates'))
    return ({
      python: `from typing import List\ndef wallsAndGates(rooms: List[List[int]]) -> None:\n    # Fill each empty room with distance to nearest gate\n    pass`,
      javascript: `function wallsAndGates(rooms) {\n    // Fill rooms with distance to nearest gate\n}`,
      java: `class Solution {\n    public void wallsAndGates(int[][] rooms) {\n        // Fill rooms with distance to nearest gate\n    }\n}`,
      cpp: `class Solution {\npublic:\n    void wallsAndGates(vector<vector<int>>& rooms) {\n        // Fill rooms with distance to nearest gate\n    }\n};`,
      typescript: `function wallsAndGates(rooms: number[][]): void {\n    // Fill rooms with distance to nearest gate\n}`,
    });
  if (t.includes('course schedule') && !t.includes('ii'))
    return bool('canFinish', 'numCourses: int, prerequisites: List[List[int]]', 'Determine if all courses can be finished');
  if (t.includes('course schedule ii'))
    return arr('findOrder', 'numCourses: int, prerequisites: List[List[int]]', 'Return order to finish all courses');
  if (t.includes('redundant connection'))
    return arr('findRedundantConnection', 'edges: List[List[int]]', 'Find redundant edge in graph');
  if (t.includes('number of connected components'))
    return simple('countComponents', 'n, edges', 'Count connected components in undirected graph');
  if (t.includes('graph valid tree'))
    return bool('validTree', 'n: int, edges: List[List[int]]', 'Determine if edges form a valid tree');
  if (t.includes('word ladder'))
    return simple('ladderLength', 'beginWord, endWord, wordList', 'Return length of shortest transformation sequence');

  // Advanced Graphs
  if (t.includes('reconstruct itinerary'))
    return ({
      python: `from typing import List\ndef findItinerary(tickets: List[List[str]]) -> List[str]:\n    # Reconstruct itinerary in order\n    pass`,
      javascript: `function findItinerary(tickets) {\n    // Reconstruct itinerary\n}`,
      java: `class Solution {\n    public List<String> findItinerary(List<List<String>> tickets) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<string> findItinerary(vector<vector<string>>& tickets) {\n        return {};\n    }\n};`,
      typescript: `function findItinerary(tickets: string[][]): string[] {\n    return [];\n}`,
    });
  if (t.includes('min cost to connect all points'))
    return simple('minCostConnectPoints', 'points', 'Return minimum cost to connect all points');
  if (t.includes('network delay time'))
    return simple('networkDelayTime', 'times, n, k', 'Return time for all nodes to receive signal');
  if (t.includes('swim in rising water'))
    return simple('swimInWater', 'grid', 'Return minimum time to swim from top-left to bottom-right');
  if (t.includes('alien dictionary'))
    return str('alienOrder', 'words: List[str]', 'Return order of characters in alien language');
  if (t.includes('cheapest flights within k stops'))
    return simple('findCheapestPrice', 'n, flights, src, dst, k', 'Return cheapest price with at most k stops');

  // 1D DP
  if (t.includes('climbing stairs'))
    return simple('climbStairs', 'n', 'Return number of ways to climb n stairs');
  if (t.includes('min cost climbing stairs'))
    return simple('minCostClimbingStairs', 'cost', 'Return minimum cost to reach the top');
  if (t.includes('house robber') && !t.includes('ii'))
    return simple('rob', 'nums', 'Return maximum amount that can be robbed');
  if (t.includes('house robber ii'))
    return simple('rob', 'nums', 'Return maximum amount from circular houses');
  if (t.includes('longest palindromic substring'))
    return str('longestPalindrome', 's: str', 'Return longest palindromic substring');
  if (t.includes('palindromic substrings'))
    return simple('countSubstrings', 's', 'Count palindromic substrings');
  if (t.includes('decode ways'))
    return simple('numDecodings', 's', 'Return number of ways to decode string');
  if (t.includes('coin change') && !t.includes('ii'))
    return simple('coinChange', 'coins, amount', 'Return minimum coins needed to make amount');
  if (t.includes('maximum product subarray'))
    return simple('maxProduct', 'nums', 'Return maximum product subarray');
  if (t.includes('word break'))
    return bool('wordBreak', 's: str, wordDict: List[str]', 'Return true if s can be segmented using wordDict');
  if (t.includes('longest increasing subsequence'))
    return simple('lengthOfLIS', 'nums', 'Return length of longest strictly increasing subsequence');
  if (t.includes('partition equal subset sum'))
    return bool('canPartition', 'nums: List[int]', 'Determine if array can be partitioned into two equal sum subsets');

  // 2D DP
  if (t.includes('unique paths'))
    return simple('uniquePaths', 'm, n', 'Return number of unique paths in m x n grid');
  if (t.includes('longest common subsequence'))
    return simple('longestCommonSubsequence', 'text1, text2', 'Return length of longest common subsequence');
  if (t.includes('best time to buy and sell stock with cooldown'))
    return simple('maxProfit', 'prices', 'Return max profit with cooldown constraint');
  if (t.includes('coin change ii'))
    return simple('change', 'amount, coins', 'Return number of combinations to make amount');
  if (t.includes('target sum'))
    return simple('findTargetSumWays', 'nums, target', 'Return number of ways to assign +/- to reach target');
  if (t.includes('interleaving string'))
    return bool('isInterleave', 's1: str, s2: str, s3: str', 'Return true if s3 is an interleaving of s1 and s2');
  if (t.includes('longest increasing path in a matrix'))
    return simple('longestIncreasingPath', 'matrix', 'Return length of longest increasing path in matrix');
  if (t.includes('distinct subsequences'))
    return simple('numDistinct', 's, t', 'Return number of distinct subsequences of s which equal t');
  if (t.includes('edit distance'))
    return simple('minDistance', 'word1, word2', 'Return minimum edit distance between two words');
  if (t.includes('burst balloons'))
    return simple('maxCoins', 'nums', 'Return maximum coins from bursting balloons');
  if (t.includes('regular expression matching'))
    return bool('isMatch', 's: str, p: str', 'Return true if s matches pattern p');

  // Greedy
  if (t.includes('maximum subarray'))
    return simple('maxSubArray', 'nums', 'Return maximum subarray sum');
  if (t.includes('jump game') && !t.includes('ii'))
    return bool('canJump', 'nums: List[int]', 'Return true if you can reach the last index');
  if (t.includes('jump game ii'))
    return simple('jump', 'nums', 'Return minimum jumps to reach last index');
  if (t.includes('gas station'))
    return simple('canCompleteCircuit', 'gas, cost', 'Return starting gas station index to complete circuit');
  if (t.includes('hand of straights'))
    return bool('isNStraightHand', 'hand: List[int], groupSize: int', 'Return true if hand can be rearranged into groups');
  if (t.includes('merge intervals'))
    return arr('merge', 'intervals: List[List[int]]', 'Merge all overlapping intervals', 'List[List[int]]', 'number[][]', 'int[][]', 'vector<vector<int>>');
  if (t.includes('insert interval'))
    return arr('insert', 'intervals: List[List[int]], newInterval: List[int]', 'Insert new interval into sorted list', 'List[List[int]]', 'number[][]', 'int[][]', 'vector<vector<int>>');
  if (t.includes('minimum number of arrows to burst balloons'))
    return simple('findMinArrowShots', 'points', 'Return minimum arrows to burst all balloons');

  // Intervals
  if (t.includes('non-overlapping intervals') || t.includes('non overlapping intervals'))
    return simple('eraseOverlapIntervals', 'intervals', 'Return minimum intervals to remove for no overlaps');
  if (t.includes('meeting rooms') && !t.includes('ii'))
    return bool('canAttendMeetings', 'intervals: List[List[int]]', 'Return true if person can attend all meetings');
  if (t.includes('meeting rooms ii'))
    return simple('minMeetingRooms', 'intervals', 'Return minimum conference rooms required');

  // Math & Geometry
  if (t.includes('rotate image'))
    return ({
      python: `from typing import List\ndef rotate(matrix: List[List[int]]) -> None:\n    # Rotate matrix 90 degrees clockwise in-place\n    pass`,
      javascript: `function rotate(matrix) {\n    // Rotate matrix 90 degrees in-place\n}`,
      java: `class Solution {\n    public void rotate(int[][] matrix) {\n        // Rotate matrix 90 degrees\n    }\n}`,
      cpp: `class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Rotate matrix 90 degrees\n    }\n};`,
      typescript: `function rotate(matrix: number[][]): void {\n    // Rotate matrix 90 degrees\n}`,
    });
  if (t.includes('spiral matrix'))
    return arr('spiralOrder', 'matrix: List[List[int]]', 'Return elements of matrix in spiral order');
  if (t.includes('set matrix zeroes'))
    return ({
      python: `from typing import List\ndef setZeroes(matrix: List[List[int]]) -> None:\n    # Set entire row and column to 0 if element is 0\n    pass`,
      javascript: `function setZeroes(matrix) {\n    // Set rows and columns with zeros to all zeros\n}`,
      java: `class Solution {\n    public void setZeroes(int[][] matrix) {\n        // Set rows and columns with zeros\n    }\n}`,
      cpp: `class Solution {\npublic:\n    void setZeroes(vector<vector<int>>& matrix) {\n        // Set rows and columns with zeros\n    }\n};`,
      typescript: `function setZeroes(matrix: number[][]): void {\n    // Set rows and columns with zeros\n}`,
    });
  if (t.includes('happy number'))
    return bool('isHappy', 'n: int', 'Return true if n is a happy number');
  if (t.includes('plus one'))
    return arr('plusOne', 'digits: List[int]', 'Add one to number represented as array');
  if (t.includes('pow(x, n)') || t.includes('powx-n') || t.includes('pow x n'))
    return ({
      python: `def myPow(x: float, n: int) -> float:\n    # Implement pow(x, n)\n    pass`,
      javascript: `function myPow(x, n) {\n    // Implement pow(x, n)\n}`,
      java: `class Solution {\n    public double myPow(double x, int n) {\n        return 0.0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    double myPow(double x, int n) {\n        return 0.0;\n    }\n};`,
      typescript: `function myPow(x: number, n: number): number {\n    return 0;\n}`,
    });
  if (t.includes('multiply strings'))
    return str('multiply', 'num1: str, num2: str', 'Multiply two non-negative integers represented as strings');
  if (t.includes('detect squares'))
    return ({
      python: `class DetectSquares:\n    def __init__(self):\n        pass\n    def add(self, point: List[int]) -> None:\n        pass\n    def count(self, point: List[int]) -> int:\n        pass`,
      javascript: `class DetectSquares {\n    constructor() {}\n    add(point) {}\n    count(point) { return 0; }\n}`,
      java: `class DetectSquares {\n    public DetectSquares() {}\n    public void add(int[] point) {}\n    public int count(int[] point) { return 0; }\n}`,
      cpp: `class DetectSquares {\npublic:\n    DetectSquares() {}\n    void add(vector<int> point) {}\n    int count(vector<int> point) { return 0; }\n};`,
      typescript: `class DetectSquares {\n    constructor() {}\n    add(point: number[]): void {}\n    count(point: number[]): number { return 0; }\n}`,
    });

  // Bit Manipulation
  if (t.includes('single number'))
    return simple('singleNumber', 'nums', 'Return element that appears only once');
  if (t.includes('number of 1 bits') || t.includes('number of 1-bits'))
    return simple('hammingWeight', 'n', 'Return number of 1 bits in integer');
  if (t.includes('counting bits'))
    return arr('countBits', 'n: int', 'Return array of count of 1 bits for 0 to n');
  if (t.includes('reverse bits'))
    return simple('reverseBits', 'n', 'Reverse bits of a 32-bit unsigned integer');
  if (t.includes('missing number'))
    return simple('missingNumber', 'nums', 'Return missing number in range [0, n]');
  if (t.includes('sum of two integers'))
    return simple('getSum', 'a, b', 'Return sum of two integers without using + or -');
  if (t.includes('reverse integer'))
    return simple('reverse', 'x', 'Reverse digits of a 32-bit signed integer');

  // Default fallback
  return {
    python:     `def solution(input):\n    # Write your solution here\n    pass`,
    javascript: `function solution(input) {\n    // Write your solution here\n}`,
    java:       `class Solution {\n    public int solution(int input) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    cpp:        `class Solution {\npublic:\n    int solution(int input) {\n        // Write your solution here\n        return 0;\n    }\n};`,
    typescript: `function solution(input: number): number {\n    // Write your solution here\n    return 0;\n}`,
  };
}

// ── Recursive file walker (handles subfolders) ────────────────────────────────
function getAllMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Delete existing problems ──────────────────────────────────────────────────
async function deleteAllExistingProblems() {
  console.log('🗑️  Deleting all existing problems...');
  await prisma.$executeRaw`TRUNCATE TABLE "submissions" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "discussions" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "contest_problems" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "mock_interview_problems" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "pair_sessions" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "study_plan_problems" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "weekly_challenge_problems" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "problems" RESTART IDENTITY CASCADE;`;
  const deleted = await prisma.problem.deleteMany({});
  console.log(`✅ Deleted ${deleted.count} existing problems\n`);
}

// ── Main importer ─────────────────────────────────────────────────────────────
async function importAllProblems(problemsPath: string) {
  if (!fs.existsSync(problemsPath)) {
    console.error(`❌ Directory not found: ${problemsPath}`);
    return;
  }

  const files = getAllMarkdownFiles(problemsPath).sort();
  console.log(`📁 Found ${files.length} markdown files (including subfolders)\n`);

  let imported = 0;
  let failed = 0;
  const failedFiles: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const fileName = path.basename(filePath);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const problemData = parseMarkdownFile(content);

      if (!problemData.title) {
        console.log(`⚠️  Skipping ${fileName}: No title found`);
        failed++;
        failedFiles.push(fileName);
        continue;
      }

      const numberMatch = fileName.match(/^(\d+)/) || problemData.title.match(/^(\d+)/);
      const problemNumber = numberMatch ? parseInt(numberMatch[1]) : i + 1;

      const slug = generateSlug(problemData.title, problemNumber);
      
      // Parse examples from markdown content as test cases
      let testCases = parseExamples(content);
      if (testCases.length === 0) {
        testCases = generateTestCases(problemData.title, problemData.difficulty);
      }

      // Generate starter code with driver functions using the generated test cases
      const starterCode = generateStarterCode(problemData.title, slug, testCases);
      
      const normalizedDifficulty = normalizeDifficulty(problemData.difficulty);
      
      // Generate enhanced examples
      const enhancedExamples = generateExamples(problemData.title);

      console.log(`📝 Importing: ${problemNumber}. ${problemData.title} (${problemData.difficulty} -> ${normalizedDifficulty})`);

      const problem = await prisma.problem.create({
        data: {
          title: `${problemNumber}. ${problemData.title}`,
          slug,
          description: problemData.description || enhancedExamples || 'Problem description',
          difficulty: normalizedDifficulty,
          tags: problemData.topics.slice(0, 5),
          testCases: testCases,
          starterCode,
          isPremium: false,
          acceptanceRate: Math.random() * 40 + 30,
        },
      });

      console.log(`✅ [${imported + 1}/${files.length}] Successfully imported: ${problem.title} (${testCases.length} test cases)`);
      imported++;
    } catch (error) {
      console.error(`❌ Failed to import ${fileName}:`, error instanceof Error ? error.message : error);
      failed++;
      failedFiles.push(fileName);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total files: ${files.length}`);

  if (failedFiles.length > 0) {
    console.log('\n⚠️  Failed files:');
    failedFiles.forEach(f => console.log(`   - ${f}`));
  }

  const totalProblems = await prisma.problem.count();
  console.log(`\n📚 Total problems in database: ${totalProblems}`);
  console.log(`📋 Total test cases generated: ${totalProblems * 4}+`);
}
// ── Entry point ───────────────────────────────────────────────────────────────
async function main() {
  const problemsPath = process.argv[2];

  if (!problemsPath) {
    console.error('❌ Please provide the path to your neetcode_150 folder');
    console.log('\nUsage:');
    console.log('  npm run import:neetcode "C:\\path\\to\\neetcode_150"');
    console.log('\nExample:');
    console.log('  npm run import:neetcode "C:\\Users\\prart\\Documents\\New folder\\neetcode_150"');
    process.exit(1);
  }

  console.log('🚀 Starting NeetCode 150 Import');
  console.log('='.repeat(50));
  console.log(`📂 Source: ${problemsPath}`);
  console.log(`💾 Database: PostgreSQL via Prisma\n`);
  console.log('⚠️  WARNING: This will DELETE ALL EXISTING PROBLEMS from your database!');
  console.log('Press Ctrl+C within 10 seconds to cancel...\n');

  await new Promise(resolve => setTimeout(resolve, 10000));

  try {
    await deleteAllExistingProblems();
    await importAllProblems(problemsPath);
    console.log('\n✨ Import completed successfully!');
  } catch (error) {
    console.error('\n💥 Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);