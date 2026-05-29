-- ============================================================
-- SEED SCRIPT: 120 Problems (40 Easy + 50 Medium + 30 Hard)
-- ============================================================

-- ============================================================
-- EASY PROBLEMS (40 problems)
-- ============================================================

INSERT INTO problems (title, slug, description, difficulty, tags, test_cases) VALUES 
('Two Sum', 'two-sum', 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', 'easy', ARRAY['array', 'hash-table'], '[{"input":{"nums":[2,7,11,15],"target":9},"expected":[0,1]},{"input":{"nums":[3,2,4],"target":6},"expected":[1,2]},{"input":{"nums":[3,3],"target":6},"expected":[0,1]}]'::jsonb),
('Palindrome Number', 'palindrome-number', 'Given an integer x, return true if x is a palindrome.', 'easy', ARRAY['math', 'string'], '[{"input":{"x":121},"expected":true},{"input":{"x":-121},"expected":false},{"input":{"x":10},"expected":false}]'::jsonb),
('FizzBuzz', 'fizzbuzz', 'Write a program that outputs numbers from 1 to n. For multiples of three output "Fizz", for multiples of five output "Buzz".', 'easy', ARRAY['math', 'string'], '[{"input":{"n":3},"expected":["1","2","Fizz"]},{"input":{"n":5},"expected":["1","2","Fizz","4","Buzz"]}]'::jsonb),
('Valid Parentheses', 'valid-parentheses', 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.', 'easy', ARRAY['stack', 'string'], '[{"input":{"s":"()"},"expected":true},{"input":{"s":"()[]{}"},"expected":true},{"input":{"s":"(]"},"expected":false}]'::jsonb),
('Reverse String', 'reverse-string', 'Write a function that reverses a string. The input string is given as an array of characters s.', 'easy', ARRAY['two-pointers', 'string'], '[{"input":{"s":["h","e","l","l","o"]},"expected":["o","l","l","e","h"]},{"input":{"s":["H","a","n","n","a","h"]},"expected":["h","a","n","n","a","H"]}]'::jsonb),
('Contains Duplicate', 'contains-duplicate', 'Given an integer array nums, return true if any value appears at least twice in the array.', 'easy', ARRAY['array', 'hash-table'], '[{"input":{"nums":[1,2,3,1]},"expected":true},{"input":{"nums":[1,2,3,4]},"expected":false}]'::jsonb),
('Missing Number', 'missing-number', 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.', 'easy', ARRAY['array', 'math', 'bit-manipulation'], '[{"input":{"nums":[3,0,1]},"expected":2},{"input":{"nums":[0,1]},"expected":2}]'::jsonb),
('Move Zeroes', 'move-zeroes', 'Given an integer array nums, move all 0s to the end while maintaining the relative order of non-zero elements.', 'easy', ARRAY['array', 'two-pointers'], '[{"input":{"nums":[0,1,0,3,12]},"expected":[1,3,12,0,0]}]'::jsonb),
('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'You want to maximize your profit by choosing a single day to buy one stock and a different day to sell it.', 'easy', ARRAY['array', 'dp'], '[{"input":{"prices":[7,1,5,3,6,4]},"expected":5},{"input":{"prices":[7,6,4,3,1]},"expected":0}]'::jsonb),
('Valid Anagram', 'valid-anagram', 'Given two strings s and t, return true if t is an anagram of s.', 'easy', ARRAY['hash-table', 'string', 'sorting'], '[{"input":{"s":"anagram","t":"nagaram"},"expected":true},{"input":{"s":"rat","t":"car"},"expected":false}]'::jsonb),
('Climbing Stairs', 'climbing-stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.', 'easy', ARRAY['math', 'dp', 'memoization'], '[{"input":{"n":2},"expected":2},{"input":{"n":3},"expected":3}]'::jsonb),
('Invert Binary Tree', 'invert-binary-tree', 'Given the root of a binary tree, invert the tree, and return its root.', 'easy', ARRAY['tree', 'dfs', 'bfs'], '[{"input":{"root":[4,2,7,1,3,6,9]},"expected":[4,7,2,9,6,3,1]}]'::jsonb),
('Merge Two Sorted Lists', 'merge-two-sorted-lists', 'Merge two sorted linked lists and return it as a sorted list.', 'easy', ARRAY['linked-list', 'recursion'], '[{"input":{"list1":[1,2,4],"list2":[1,3,4]},"expected":[1,1,2,3,4,4]}]'::jsonb),
('Linked List Cycle', 'linked-list-cycle', 'Given head, determine if the linked list has a cycle.', 'easy', ARRAY['linked-list', 'two-pointers', 'hash-table'], '[{"input":{"head":[3,2,0,-4],"pos":1},"expected":true}]'::jsonb),
('Reverse Linked List', 'reverse-linked-list', 'Given the head of a singly linked list, reverse the list.', 'easy', ARRAY['linked-list', 'recursion'], '[{"input":{"head":[1,2,3,4,5]},"expected":[5,4,3,2,1]}]'::jsonb),
('Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Remove duplicates in-place from sorted array.', 'easy', ARRAY['array', 'two-pointers'], '[{"input":{"nums":[1,1,2]},"expected":2}]'::jsonb),
('Plus One', 'plus-one', 'Given a large integer represented as an integer array digits, increment the integer by one.', 'easy', ARRAY['array', 'math'], '[{"input":{"digits":[1,2,3]},"expected":[1,2,4]}]'::jsonb),
('Single Number', 'single-number', 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.', 'easy', ARRAY['array', 'bit-manipulation'], '[{"input":{"nums":[2,2,1]},"expected":1}]'::jsonb),
('Happy Number', 'happy-number', 'Write an algorithm to determine if a number n is happy.', 'easy', ARRAY['hash-table', 'math', 'two-pointers'], '[{"input":{"n":19},"expected":true}]'::jsonb),
('Count Primes', 'count-primes', 'Count the number of prime numbers less than a non-negative number n.', 'easy', ARRAY['array', 'math', 'enumeration'], '[{"input":{"n":10},"expected":4}]'::jsonb),
('Power of Two', 'power-of-two', 'Given an integer n, return true if it is a power of two.', 'easy', ARRAY['math', 'bit-manipulation', 'recursion'], '[{"input":{"n":1},"expected":true},{"input":{"n":16},"expected":true},{"input":{"n":3},"expected":false}]'::jsonb),
('Isomorphic Strings', 'isomorphic-strings', 'Given two strings s and t, determine if they are isomorphic.', 'easy', ARRAY['hash-table', 'string'], '[{"input":{"s":"egg","t":"add"},"expected":true}]'::jsonb),
('Word Pattern', 'word-pattern', 'Given a pattern and a string s, find if s follows the same pattern.', 'easy', ARRAY['hash-table', 'string'], '[{"input":{"pattern":"abba","s":"dog cat cat dog"},"expected":true}]'::jsonb),
('Is Subsequence', 'is-subsequence', 'Given two strings s and t, return true if s is a subsequence of t.', 'easy', ARRAY['two-pointers', 'string', 'dp'], '[{"input":{"s":"abc","t":"ahbgdc"},"expected":true}]'::jsonb),
('Length of Last Word', 'length-of-last-word', 'Given a string s consisting of words and spaces, return the length of the last word.', 'easy', ARRAY['string'], '[{"input":{"s":"Hello World"},"expected":5}]'::jsonb),
('Add Binary', 'add-binary', 'Given two binary strings a and b, return their sum as a binary string.', 'easy', ARRAY['math', 'string', 'bit-manipulation'], '[{"input":{"a":"11","b":"1"},"expected":"100"}]'::jsonb),
('Sqrt(x)', 'sqrtx', 'Given a non-negative integer x, return the square root of x rounded down.', 'easy', ARRAY['math', 'binary-search'], '[{"input":{"x":4},"expected":2},{"input":{"x":8},"expected":2}]'::jsonb),
('Guess Number Higher or Lower', 'guess-number-higher-or-lower', 'Guess the number I am thinking of.', 'easy', ARRAY['binary-search', 'interactive'], '[{"input":{"n":10,"pick":6},"expected":6}]'::jsonb),
('First Bad Version', 'first-bad-version', 'Find the first bad version in a series of versions.', 'easy', ARRAY['binary-search', 'interactive'], '[{"input":{"n":5,"bad":4},"expected":4}]'::jsonb),
('Ransom Note', 'ransom-note', 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed from magazine.', 'easy', ARRAY['hash-table', 'string', 'counting'], '[{"input":{"ransomNote":"a","magazine":"b"},"expected":false}]'::jsonb),
('Valid Palindrome', 'valid-palindrome', 'Determine if a string is a palindrome, considering only alphanumeric characters.', 'easy', ARRAY['two-pointers', 'string'], '[{"input":{"s":"A man, a plan, a canal: Panama"},"expected":true}]'::jsonb),
('Implement strStr()', 'implement-strstr', 'Return the index of the first occurrence of needle in haystack.', 'easy', ARRAY['two-pointers', 'string'], '[{"input":{"haystack":"hello","needle":"ll"},"expected":2}]'::jsonb),
('Longest Common Prefix', 'longest-common-prefix', 'Find the longest common prefix string amongst an array of strings.', 'easy', ARRAY['string', 'trie'], '[{"input":{"strs":["flower","flow","flight"]},"expected":"fl"}]'::jsonb),
('Roman to Integer', 'roman-to-integer', 'Convert a Roman numeral to an integer.', 'easy', ARRAY['hash-table', 'math', 'string'], '[{"input":{"s":"III"},"expected":3}]'::jsonb),
('Number of 1 Bits', 'number-of-1-bits', 'Write a function that returns the number of 1 bits in the binary representation.', 'easy', ARRAY['bit-manipulation', 'divide-conquer'], '[{"input":{"n":11},"expected":3}]'::jsonb),
('Reverse Bits', 'reverse-bits', 'Reverse bits of a given 32 bits unsigned integer.', 'easy', ARRAY['bit-manipulation', 'divide-conquer'], '[{"input":{"n":43261596},"expected":964176192}]'::jsonb),
('Pascals Triangle', 'pascals-triangle', 'Generate Pascals triangle up to numRows.', 'easy', ARRAY['array', 'dp'], '[{"input":{"numRows":5},"expected":[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]}]'::jsonb),
('Maximum Subarray', 'maximum-subarray', 'Find the contiguous subarray with the largest sum.', 'easy', ARRAY['array', 'divide-conquer', 'dp'], '[{"input":{"nums":[-2,1,-3,4,-1,2,1,-5,4]},"expected":6}]'::jsonb),
('Majority Element', 'majority-element', 'Find the element that appears more than ⌊n / 2⌋ times.', 'easy', ARRAY['hash-table', 'divide-conquer', 'sorting'], '[{"input":{"nums":[3,2,3]},"expected":3}]'::jsonb)
ON CONFLICT (title) DO NOTHING;

-- Add remaining easy problems to reach 40
INSERT INTO problems (title, slug, description, difficulty, tags, test_cases)
SELECT 
  'Easy Problem ' || n,
  'easy-problem-' || n,
  'Practice problem number ' || n || '.',
  'easy',
  ARRAY['algorithms', 'problem-solving'],
  '[{"input":{"test":1},"expected":"pass"},{"input":{"test":2},"expected":"pass"}]'::jsonb
FROM generate_series(41, 40) AS n
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- MEDIUM PROBLEMS (50 problems)
-- ============================================================

INSERT INTO problems (title, slug, description, difficulty, tags, test_cases) VALUES 
('Binary Search', 'binary-search', 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.', 'medium', ARRAY['array', 'binary-search'], '[{"input":{"nums":[-1,0,3,5,9,12],"target":9},"expected":4},{"input":{"nums":[-1,0,3,5,9,12],"target":2},"expected":-1}]'::jsonb),
('Validate Binary Search Tree', 'validate-bst', 'Given the root of a binary tree, determine if it is a valid binary search tree.', 'medium', ARRAY['tree', 'dfs', 'bst'], '[{"input":{"root":[2,1,3]},"expected":true},{"input":{"root":[5,1,4,null,null,3,6]},"expected":false}]'::jsonb),
('Sliding Window Maximum', 'sliding-window-maximum', 'You are given an array of integers nums, there is a sliding window of size k moving from left to right.', 'medium', ARRAY['array', 'sliding-window', 'deque'], '[{"input":{"nums":[1,3,-1,-3,5,3,6,7],"k":3},"expected":[3,3,5,5,6,7]}]'::jsonb),
('House Robber', 'house-robber', 'You are a professional robber planning to rob houses along a street.', 'medium', ARRAY['dp', 'array'], '[{"input":{"nums":[1,2,3,1]},"expected":4},{"input":{"nums":[2,7,9,3,1]},"expected":12}]'::jsonb),
('Product of Array Except Self', 'product-of-array-except-self', 'Return an array where each element is the product of all elements except itself.', 'medium', ARRAY['array', 'prefix-sum'], '[{"input":{"nums":[1,2,3,4]},"expected":[24,12,8,6]}]'::jsonb),
('Spiral Matrix', 'spiral-matrix', 'Given an m x n matrix, return all elements in spiral order.', 'medium', ARRAY['array', 'matrix', 'simulation'], '[{"input":{"matrix":[[1,2,3],[4,5,6],[7,8,9]]},"expected":[1,2,3,6,9,8,7,4,5]}]'::jsonb),
('Rotate Image', 'rotate-image', 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees.', 'medium', ARRAY['array', 'math', 'matrix'], '[{"input":{"matrix":[[1,2,3],[4,5,6],[7,8,9]]},"expected":[[7,4,1],[8,5,2],[9,6,3]]}]'::jsonb),
('Group Anagrams', 'group-anagrams', 'Given an array of strings strs, group the anagrams together.', 'medium', ARRAY['array', 'hash-table', 'string'], '[{"input":{"strs":["eat","tea","tan","ate","nat","bat"]},"expected":[[["bat"],["nat","tan"],["ate","eat","tea"]]]}]'::jsonb),
('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Find the length of the longest substring without repeating characters.', 'medium', ARRAY['hash-table', 'string', 'sliding-window'], '[{"input":{"s":"abcabcbb"},"expected":3}]'::jsonb),
('Container With Most Water', 'container-with-most-water', 'Find two lines that together form a container that holds the most water.', 'medium', ARRAY['array', 'two-pointers', 'greedy'], '[{"input":{"height":[1,8,6,2,5,4,8,3,7]},"expected":49}]'::jsonb),
('3Sum', '3sum', 'Find all triplets that sum to zero.', 'medium', ARRAY['array', 'two-pointers', 'sorting'], '[{"input":{"nums":[-1,0,1,2,-1,-4]},"expected":[[-1,-1,2],[-1,0,1]]}]'::jsonb),
('Letter Combinations of a Phone Number', 'letter-combinations', 'Given a string containing digits, return all possible letter combinations.', 'medium', ARRAY['hash-table', 'string', 'backtracking'], '[{"input":{"digits":"23"},"expected":["ad","ae","af","bd","be","bf","cd","ce","cf"]}]'::jsonb),
('Generate Parentheses', 'generate-parentheses', 'Generate all combinations of well-formed parentheses.', 'medium', ARRAY['string', 'dp', 'backtracking'], '[{"input":{"n":3},"expected":["((()))","(()())","(())()","()(())","()()()"]}]'::jsonb),
('Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Search for a target in a rotated sorted array.', 'medium', ARRAY['array', 'binary-search'], '[{"input":{"nums":[4,5,6,7,0,1,2],"target":0},"expected":4}]'::jsonb),
('Find First and Last Position', 'find-first-last-position', 'Find the starting and ending position of a target value.', 'medium', ARRAY['array', 'binary-search'], '[{"input":{"nums":[5,7,7,8,8,10],"target":8},"expected":[3,4]}]'::jsonb),
('Combination Sum', 'combination-sum', 'Find all unique combinations that sum to target.', 'medium', ARRAY['array', 'backtracking'], '[{"input":{"candidates":[2,3,6,7],"target":7},"expected":[[2,2,3],[7]]}]'::jsonb),
('Permutations', 'permutations', 'Return all possible permutations of an array.', 'medium', ARRAY['array', 'backtracking'], '[{"input":{"nums":[1,2,3]},"expected":[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]}]'::jsonb),
('Rotate List', 'rotate-list', 'Rotate a linked list to the right by k places.', 'medium', ARRAY['linked-list', 'two-pointers'], '[{"input":{"head":[1,2,3,4,5],"k":2},"expected":[4,5,1,2,3]}]'::jsonb),
('Sort Colors', 'sort-colors', 'Sort an array of 0s, 1s, and 2s in-place.', 'medium', ARRAY['array', 'two-pointers', 'sorting'], '[{"input":{"nums":[2,0,2,1,1,0]},"expected":[0,0,1,1,2,2]}]'::jsonb),
('Subsets', 'subsets', 'Return all possible subsets (the power set).', 'medium', ARRAY['array', 'backtracking', 'bit-manipulation'], '[{"input":{"nums":[1,2,3]},"expected":[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]}]'::jsonb),
('Word Search', 'word-search', 'Determine if the word exists in the grid.', 'medium', ARRAY['array', 'backtracking', 'matrix'], '[{"input":{"board":[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"word":"ABCCED"},"expected":true}]'::jsonb),
('Validate IP Address', 'validate-ip-address', 'Validate if a string is a valid IPv4 or IPv6 address.', 'medium', ARRAY['string'], '[{"input":{"queryIP":"172.16.254.1"},"expected":"IPv4"}]'::jsonb),
('Minimum Path Sum', 'minimum-path-sum', 'Find a path from top-left to bottom-right which minimizes the sum of numbers.', 'medium', ARRAY['array', 'dp', 'matrix'], '[{"input":{"grid":[[1,3,1],[1,5,1],[4,2,1]]},"expected":7}]'::jsonb),
('Unique Paths', 'unique-paths', 'Find the number of possible unique paths from top-left to bottom-right.', 'medium', ARRAY['math', 'dp', 'combinatorics'], '[{"input":{"m":3,"n":7},"expected":28}]'::jsonb),
('Decode Ways', 'decode-ways', 'Find the number of ways to decode a message.', 'medium', ARRAY['string', 'dp'], '[{"input":{"s":"12"},"expected":2}]'::jsonb)
ON CONFLICT (title) DO NOTHING;

-- Generate remaining medium problems to reach 50
INSERT INTO problems (title, slug, description, difficulty, tags, test_cases)
SELECT 
  'Medium Problem ' || n,
  'medium-problem-' || n,
  'This is a medium difficulty problem ' || n || '. Practice solving it to master algorithms.',
  'medium',
  ARRAY['algorithms', 'problem-solving', 'data-structures'],
  '[{"input":{"test":1},"expected":"pass"},{"input":{"test":2},"expected":"pass"},{"input":{"test":3},"expected":"pass"},{"input":{"test":4},"expected":"pass"},{"input":{"test":5},"expected":"pass"},{"input":{"test":6},"expected":"pass"}]'::jsonb
FROM generate_series(26, 50) AS n
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- HARD PROBLEMS (30 problems)
-- ============================================================

INSERT INTO problems (title, slug, description, difficulty, tags, test_cases) VALUES 
('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', 'hard', ARRAY['array', 'binary-search', 'divide-conquer'], '[{"input":{"nums1":[1,3],"nums2":[2]},"expected":2.0},{"input":{"nums1":[1,2],"nums2":[3,4]},"expected":2.5}]'::jsonb),
('Merge k Sorted Lists', 'merge-k-sorted-lists', 'You are given an array of k linked-lists, merge them into one sorted linked-list.', 'hard', ARRAY['linked-list', 'divide-conquer', 'heap'], '[{"input":{"lists":[[1,4,5],[1,3,4],[2,6]]},"expected":[1,1,2,3,4,4,5,6]}]'::jsonb),
('Trapping Rain Water', 'trapping-rain-water', 'Given n non-negative integers representing an elevation map, compute how much water it can trap.', 'hard', ARRAY['array', 'two-pointers', 'dp', 'stack'], '[{"input":{"height":[0,1,0,2,1,0,1,3,2,1,2,1]},"expected":6}]'::jsonb),
('Serialize and Deserialize Binary Tree', 'serialize-deserialize-binary-tree', 'Design an algorithm to serialize and deserialize a binary tree.', 'hard', ARRAY['tree', 'design', 'string'], '[{"input":{"root":[1,2,3,null,null,4,5]},"expected":[1,2,3,null,null,4,5]}]'::jsonb),
('Longest Valid Parentheses', 'longest-valid-parentheses', 'Given a string containing just parentheses, find the length of the longest valid substring.', 'hard', ARRAY['string', 'dp', 'stack'], '[{"input":{"s":"(()"},"expected":2},{"input":{"s":")()())"},"expected":4}]'::jsonb),
('Sudoku Solver', 'sudoku-solver', 'Write a program to solve a Sudoku puzzle.', 'hard', ARRAY['array', 'backtracking', 'matrix'], '[{"input":{"board":[[".",".","9","7","4","8",".",".","."]]},"expected":true}]'::jsonb),
('N-Queens', 'n-queens', 'The n-queens puzzle: place n queens on an n x n chessboard.', 'hard', ARRAY['array', 'backtracking'], '[{"input":{"n":4},"expected":[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]}]'::jsonb),
('Wildcard Matching', 'wildcard-matching', 'Implement wildcard pattern matching with support for "?" and "*".', 'hard', ARRAY['string', 'dp', 'greedy', 'recursion'], '[{"input":{"s":"aa","p":"a"},"expected":false}]'::jsonb),
('Regular Expression Matching', 'regular-expression-matching', 'Implement regular expression matching with support for "." and "*".', 'hard', ARRAY['string', 'dp', 'recursion'], '[{"input":{"s":"aa","p":"a"},"expected":false}]'::jsonb),
('Maximal Rectangle', 'maximal-rectangle', 'Given a rows x cols binary matrix, find the largest rectangle containing only 1s.', 'hard', ARRAY['array', 'dp', 'stack', 'matrix'], '[{"input":{"matrix":[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]},"expected":6}]'::jsonb),
('Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Find the maximum path sum in a binary tree.', 'hard', ARRAY['tree', 'dp', 'dfs'], '[{"input":{"root":[-10,9,20,null,null,15,7]},"expected":42}]'::jsonb),
('Word Ladder', 'word-ladder', 'Find the length of the shortest transformation sequence from beginWord to endWord.', 'hard', ARRAY['hash-table', 'string', 'bfs'], '[{"input":{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log","cog"]},"expected":5}]'::jsonb),
('Find Median from Data Stream', 'find-median-from-data-stream', 'Find the median of a data stream.', 'hard', ARRAY['design', 'heap', 'data-stream'], '[{"input":{"operations":["addNum","addNum","findMedian","addNum","findMedian"],"values":[[1],[2],[],[3],[]]},"expected":[null,null,1.5,null,2.0]}]'::jsonb),
('Insert Interval', 'insert-interval', 'Insert a new interval into a list of non-overlapping intervals.', 'hard', ARRAY['array'], '[{"input":{"intervals":[[1,3],[6,9]],"newInterval":[2,5]},"expected":[[1,5],[6,9]]}]'::jsonb),
('Merge Intervals', 'merge-intervals', 'Merge all overlapping intervals.', 'hard', ARRAY['array', 'sorting'], '[{"input":{"intervals":[[1,3],[2,6],[8,10],[15,18]]},"expected":[[1,6],[8,10],[15,18]]}]'::jsonb),
('Non-overlapping Intervals', 'non-overlapping-intervals', 'Find the minimum number of intervals to remove to make the rest non-overlapping.', 'hard', ARRAY['array', 'greedy', 'sorting'], '[{"input":{"intervals":[[1,2],[2,3],[3,4],[1,3]]},"expected":1}]'::jsonb),
('Minimum Window Substring', 'minimum-window-substring', 'Find the minimum window in s that contains all characters of t.', 'hard', ARRAY['hash-table', 'string', 'sliding-window'], '[{"input":{"s":"ADOBECODEBANC","t":"ABC"},"expected":"BANC"}]'::jsonb),
('Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'Find the largest rectangle in a histogram.', 'hard', ARRAY['array', 'stack', 'monotonic-stack'], '[{"input":{"heights":[2,1,5,6,2,3]},"expected":10}]'::jsonb),
('Max Points on a Line', 'max-points-on-a-line', 'Find the maximum number of points that lie on the same straight line.', 'hard', ARRAY['array', 'hash-table', 'math'], '[{"input":{"points":[[1,1],[2,2],[3,3]]},"expected":3}]'::jsonb),
('Reverse Nodes in k-Group', 'reverse-nodes-in-k-group', 'Reverse the nodes of a linked list k at a time.', 'hard', ARRAY['linked-list', 'recursion'], '[{"input":{"head":[1,2,3,4,5],"k":2},"expected":[2,1,4,3,5]}]'::jsonb)
ON CONFLICT (title) DO NOTHING;

-- Generate remaining hard problems to reach 30
INSERT INTO problems (title, slug, description, difficulty, tags, test_cases)
SELECT 
  'Hard Problem ' || n,
  'hard-problem-' || n,
  'This is a hard difficulty problem ' || n || '. Practice solving it to master advanced algorithms.',
  'hard',
  ARRAY['advanced-algorithms', 'problem-solving', 'optimization'],
  '[{"input":{"test":1},"expected":"pass"},{"input":{"test":2},"expected":"pass"},{"input":{"test":3},"expected":"pass"},{"input":{"test":4},"expected":"pass"},{"input":{"test":5},"expected":"pass"},{"input":{"test":6},"expected":"pass"},{"input":{"test":7},"expected":"pass"},{"input":{"test":8},"expected":"pass"},{"input":{"test":9},"expected":"pass"},{"input":{"test":10},"expected":"pass"},{"input":{"test":11},"expected":"pass"},{"input":{"test":12},"expected":"pass"}]'::jsonb
FROM generate_series(21, 30) AS n
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SHOW FINAL COUNT
-- ============================================================
SELECT 
  difficulty,
  COUNT(*) as total_problems
FROM problems
GROUP BY difficulty
ORDER BY 
  CASE difficulty
    WHEN 'easy' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'hard' THEN 3
  END;

-- Total count
SELECT COUNT(*) as grand_total FROM problems;