-- Insert problems
INSERT INTO problems (title, description, difficulty, tags, test_cases) VALUES 
('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', 'easy', ARRAY['array', 'hash-table'], '[{"input":{"nums":[2,7,11,15],"target":9},"expected":[0,1]}]'::jsonb),
('Palindrome Number', 'Given an integer x, return true if x is a palindrome.', 'easy', ARRAY['math', 'string'], '[{"input":{"x":121},"expected":true}]'::jsonb),
('FizzBuzz', 'Write a program that outputs numbers from 1 to n.', 'easy', ARRAY['math', 'string'], '[{"input":{"n":3},"expected":["1","2","Fizz"]}]'::jsonb),
('Valid Parentheses', 'Determine if the input string is valid.', 'easy', ARRAY['stack', 'string'], '[{"input":{"s":"()"},"expected":true}]'::jsonb),
('Reverse String', 'Reverse a string array.', 'easy', ARRAY['two-pointers', 'string'], '[{"input":{"s":["h","e","l","l","o"]},"expected":["o","l","l","e","h"]}]'::jsonb)
ON CONFLICT (title) DO NOTHING;

-- Generate 35 more problems
INSERT INTO problems (title, description, difficulty, tags, test_cases)
SELECT 
  'Easy Problem ' || n,
  'Practice problem number ' || n || '.',
  'easy',
  ARRAY['algorithms', 'problem-solving'],
  '[{"input":{"test":1},"expected":"pass"}]'::jsonb
FROM generate_series(6, 40) AS n
ON CONFLICT (title) DO NOTHING;

-- Show count
SELECT COUNT(*) as total_problems FROM problems;
