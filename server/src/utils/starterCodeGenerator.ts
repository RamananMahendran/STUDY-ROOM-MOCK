import { Problem } from '@prisma/client';

function detectType(val: any, lang: string): string {
  if (Array.isArray(val)) {
    const item = val[0];
    const itemType = typeof item;
    if (itemType === 'number') {
      if (lang === 'python') return 'List[int]';
      if (lang === 'cpp') return 'vector<int>';
      if (lang === 'java') return 'int[]';
      if (lang === 'c') return 'int*';
    } else if (itemType === 'string') {
      if (lang === 'python') return 'List[str]';
      if (lang === 'cpp') return 'vector<string>';
      if (lang === 'java') return 'String[]';
      if (lang === 'c') return 'char**';
    } else if (itemType === 'boolean') {
      if (lang === 'python') return 'List[bool]';
      if (lang === 'cpp') return 'vector<bool>';
      if (lang === 'java') return 'boolean[]';
      if (lang === 'c') return 'int*';
    }
    // Nested arrays or empty arrays
    if (lang === 'python') return 'List[Any]';
    if (lang === 'cpp') return 'vector<vector<int>>';
    if (lang === 'java') return 'int[][]';
    if (lang === 'c') return 'int**';
  }

  const t = typeof val;
  if (t === 'number') {
    const isDouble = !Number.isInteger(val);
    if (lang === 'python') return isDouble ? 'float' : 'int';
    if (lang === 'cpp') return isDouble ? 'double' : 'int';
    if (lang === 'java') return isDouble ? 'double' : 'int';
    if (lang === 'c') return isDouble ? 'double' : 'int';
  } else if (t === 'string') {
    if (lang === 'python') return 'str';
    if (lang === 'cpp') return 'string';
    if (lang === 'java') return 'String';
    if (lang === 'c') return 'const char*';
  } else if (t === 'boolean') {
    if (lang === 'python') return 'bool';
    if (lang === 'cpp') return 'bool';
    if (lang === 'java') return 'boolean';
    if (lang === 'c') return 'int'; // standard C boolean representation
  }

  // Fallbacks
  if (lang === 'python') return 'Any';
  if (lang === 'cpp') return 'string';
  if (lang === 'java') return 'String';
  if (lang === 'c') return 'const char*';
  return 'void';
}

function camelCase(str: string): string {
  return str.replace(/[-_]([a-z])/g, (_, g) => g.toUpperCase());
}

export function generateStarterCode(title: string, slug: string, testCasesRaw: any): Record<string, string> {
  let testCases: any[] = [];
  try {
    testCases = typeof testCasesRaw === 'string' ? JSON.parse(testCasesRaw) : testCasesRaw;
  } catch (e) {
    testCases = [];
  }

  const sampleCase = testCases[0] || { input: {}, expected: null };
  const inputObj = sampleCase.input || {};
  const expectedVal = sampleCase.expected;

  const keys = Object.keys(inputObj);
  const functionName = camelCase(slug);

  // JavaScript Starter
  const jsParams = keys.join(', ');
  const jsExtractions = keys.map(k => `        const ${k} = data.${k};`).join('\n');
  const jsCode = `/*
 * Problem: ${title}
 * Write your code inside the solve function.
 */
function solve(${jsParams}) {
    // Write your code here
    return null;
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
const fs = require('fs');
try {
    const inputData = fs.readFileSync(0, 'utf-8').trim();
    if (inputData) {
        const data = JSON.parse(inputData);
${jsExtractions}
        const result = solve(${jsParams});
        console.log(JSON.stringify(result));
    }
} catch (e) {
    process.stderr.write('Error: ' + e.message + '\\n');
}`;

  // Python Starter
  const pyParams = keys.map(k => `${k}: ${detectType(inputObj[k], 'python')}`).join(', ');
  const pyExtractions = keys.map(k => `            ${k} = data.get("${k}")`).join('\n');
  const pySolveCall = keys.join(', ');
  const pyRetType = detectType(expectedVal, 'python');
  const pyCode = `from typing import List, Any
import sys
import json

def solve(${pyParams}) -> ${pyRetType}:
    # Write your code here
    return None

# ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip()
        if input_data:
            data = json.loads(input_data)
${pyExtractions}
            result = solve(${pySolveCall})
            print(json.dumps(result, separators=(',', ':')))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)`;

  // Java Starter
  const javaParams = keys.map(k => `${detectType(inputObj[k], 'java')} ${k}`).join(', ');
  const javaSolveCall = keys.join(', ');
  const javaRetType = detectType(expectedVal, 'java');
  
  // Custom manual parser for Java based on key types
  let javaParsingLogic = '';
  keys.forEach(k => {
    const val = inputObj[k];
    if (Array.isArray(val)) {
      javaParsingLogic += `                // Parse Array parameter: ${k}
                String ${k}Part = input.substring(input.indexOf("[") + 1, input.indexOf("]"));
                String[] ${k}Split = ${k}Part.split(",");
                int[] ${k}Val = new int[${k}Split.length];
                for (int i = 0; i < ${k}Split.length; i++) {
                    if (!${k}Split[i].trim().isEmpty()) {
                        ${k}Val[i] = Integer.parseInt(${k}Split[i].trim());
                    }
                }
`;
    } else if (typeof val === 'number') {
      javaParsingLogic += `                // Parse Number parameter: ${k}
                int ${k}Val = 0;
                int ${k}Idx = input.indexOf("\\"${k}\\"");
                if (${k}Idx != -1) {
                    String sub = input.substring(${k}Idx + \\"${k}:\\".length()).trim();
                    int comma = sub.indexOf(",");
                    int brace = sub.indexOf("}");
                    int end = comma == -1 ? brace : (brace == -1 ? comma : Math.min(comma, brace));
                    ${k}Val = Integer.parseInt(sub.substring(0, end).trim());
                }
`;
    } else if (typeof val === 'string') {
      javaParsingLogic += `                // Parse String parameter: ${k}
                String ${k}Val = "";
                int ${k}Idx = input.indexOf("\\"${k}\\"");
                if (${k}Idx != -1) {
                    String sub = input.substring(${k}Idx + \\"${k}:\\".length()).trim();
                    int firstQuote = sub.indexOf("\\"");
                    int secondQuote = sub.indexOf("\\"", firstQuote + 1);
                    ${k}Val = sub.substring(firstQuote + 1, secondQuote);
                }
`;
    } else if (typeof val === 'boolean') {
      javaParsingLogic += `                // Parse Boolean parameter: ${k}
                boolean ${k}Val = false;
                int ${k}Idx = input.indexOf("\\"${k}\\"");
                if (${k}Idx != -1) {
                    String sub = input.substring(${k}Idx + \\"${k}:\\".length()).trim();
                    ${k}Val = sub.startsWith("true");
                }
`;
    }
  });

  const javaParamsCall = keys.map(k => {
    const val = inputObj[k];
    return Array.isArray(val) || typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean'
      ? `${k}Val`
      : 'null';
  }).join(', ');

  const javaCode = `import java.util.*;
import java.io.*;

class Solution {
    public ${javaRetType} solve(${javaParams}) {
        // Write your code here
        return ${javaRetType.endsWith('[]') ? 'new int[]{}' : (javaRetType === 'boolean' ? 'false' : (javaRetType === 'int' || javaRetType === 'double' ? '0' : 'null'))};
    }
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
public class Main {
    public static void main(String[] args) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String input = sb.toString().trim();
            if (!input.isEmpty()) {
${javaParsingLogic}
                Solution solution = new Solution();
                ${javaRetType === 'void' ? '' : javaRetType + ' result = '}solution.solve(${javaParamsCall});
                
                // Output result
                ${javaRetType === 'void' ? 'System.out.println("success");' : (javaRetType.endsWith('[]') ? 'System.out.println(Arrays.toString(result).replace(" ", ""));' : 'System.out.println(result);')}
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`;

  // C++ Starter
  const cppParams = keys.map(k => {
    const type = detectType(inputObj[k], 'cpp');
    return type.includes('vector') ? `${type}& ${k}` : `${type} ${k}`;
  }).join(', ');
  const cppRetType = detectType(expectedVal, 'cpp');

  let cppParsingLogic = '';
  keys.forEach(k => {
    const val = inputObj[k];
    if (Array.isArray(val)) {
      cppParsingLogic += `        // Parse Array parameter: ${k}
        vector<int> ${k}Val;
        size_t startBrack = input.find('[');
        size_t endBrack = input.find(']');
        if (startBrack != string::npos && endBrack != string::npos) {
            string arrStr = input.substr(startBrack + 1, endBrack - startBrack - 1);
            stringstream ss(arrStr);
            string item;
            while (getline(ss, item, ',')) {
                if(!item.empty()) ${k}Val.push_back(stoi(item));
            }
        }
`;
    } else if (typeof val === 'number') {
      cppParsingLogic += `        // Parse Number parameter: ${k}
        int ${k}Val = 0;
        size_t ${k}Idx = input.find("\\"${k}\\"");
        if (${k}Idx != string::npos) {
            string sub = input.substr(${k}Idx + string("\\"${k}\\":").length());
            size_t comma = sub.find(',');
            size_t brace = sub.find('}');
            size_t endIdx = (comma == string::npos) ? brace : (brace == string::npos ? comma : min(comma, brace));
            ${k}Val = stoi(sub.substr(0, endIdx));
        }
`;
    } else if (typeof val === 'string') {
      cppParsingLogic += `        // Parse String parameter: ${k}
        string ${k}Val = "";
        size_t ${k}Idx = input.find("\\"${k}\\"");
        if (${k}Idx != string::npos) {
            string sub = input.substr(${k}Idx + string("\\"${k}\\":").length());
            size_t firstQuote = sub.find('\\"');
            size_t secondQuote = sub.find('\\"', firstQuote + 1);
            if (firstQuote != string::npos && secondQuote != string::npos) {
                ${k}Val = sub.substr(firstQuote + 1, secondQuote - firstQuote - 1);
            }
        }
`;
    } else if (typeof val === 'boolean') {
      cppParsingLogic += `        // Parse Boolean parameter: ${k}
        bool ${k}Val = false;
        size_t ${k}Idx = input.find("\\"${k}\\"");
        if (${k}Idx != string::npos) {
            string sub = input.substr(${k}Idx + string("\\"${k}\\":").length());
            if (sub.find("true") == 0 || sub.find(" true") == 0) {
                ${k}Val = true;
            }
        }
`;
    }
  });

  const cppParamsCall = keys.map(k => {
    const val = inputObj[k];
    return Array.isArray(val) || typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean'
      ? `${k}Val`
      : '';
  }).filter(Boolean).join(', ');

  const cppCode = `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

${cppRetType} solve(${cppParams}) {
    // Write your code here
    return ${cppRetType.includes('vector') ? '{}' : (cppRetType === 'bool' ? 'false' : (cppRetType === 'int' || cppRetType === 'double' ? '0' : '""'))};
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
int main() {
    string line, input;
    while (getline(cin, line)) {
        input += line;
    }
    if (!input.empty()) {
${cppParsingLogic}
        ${cppRetType === 'void' ? '' : cppRetType + ' result = '}solve(${cppParamsCall});
        
        // Output result
        ${cppRetType === 'void' ? 'cout << "success" << endl;' : (cppRetType.includes('vector') ? "cout << \"[\"; for (size_t i = 0; i < result.size(); i++) { cout << result[i]; if (i < result.size() - 1) cout << \",\"; } cout << \"]\" << endl;" : "cout << (result == true ? \"true\" : (result == false ? \"false\" : to_string(result))) << endl;")}
    }
    return 0;
}`;

  // C Starter
  const cParams = keys.map(k => {
    const type = detectType(inputObj[k], 'c');
    return `${type} ${k}`;
  }).join(', ');
  const cRetType = detectType(expectedVal, 'c');

  let cParsingLogic = '';
  keys.forEach(k => {
    const val = inputObj[k];
    if (Array.isArray(val)) {
      cParsingLogic += `        // Parse Array parameter: ${k}
        int ${k}Val[500];
        int ${k}Size = 0;
        char *startBrack = strchr(input, '[');
        char *endBrack = strchr(input, ']');
        if (startBrack && endBrack) {
            char *token = strtok(startBrack + 1, ",]");
            while (token && token < endBrack) {
                ${k}Val[${k}Size++] = atoi(token);
                token = strtok(NULL, ",]");
            }
        }
`;
    } else if (typeof val === 'number') {
      cParsingLogic += `        // Parse Number parameter: ${k}
        int ${k}Val = 0;
        char *${k}Idx = strstr(input, "\\"${k}\\"");
        if (${k}Idx) {
            char *sub = ${k}Idx + strlen("\\"${k}\\"");
            while (*sub == ':' || *sub == ' ' || *sub == '"') sub++;
            ${k}Val = atoi(sub);
        }
`;
    } else if (typeof val === 'string') {
      cParsingLogic += `        // Parse String parameter: ${k}
        char ${k}Val[256] = {0};
        char *${k}Idx = strstr(input, "\\"${k}\\"");
        if (${k}Idx) {
            char *sub = ${k}Idx + strlen("\\"${k}\\"");
            while (*sub == ':' || *sub == ' ' || *sub == '"') sub++;
            int idx = 0;
            while (*sub && *sub != '"' && idx < 255) {
                ${k}Val[idx++] = *sub++;
            }
        }
`;
    } else if (typeof val === 'boolean') {
      cParsingLogic += `        // Parse Boolean parameter: ${k}
        int ${k}Val = 0;
        char *${k}Idx = strstr(input, "\\"${k}\\"");
        if (${k}Idx) {
            char *sub = ${k}Idx + strlen("\\"${k}\\"");
            while (*sub == ':' || *sub == ' ' || *sub == '"') sub++;
            if (strncmp(sub, "true", 4) == 0) ${k}Val = 1;
        }
`;
    }
  });

  const cParamsCall = keys.map(k => {
    const val = inputObj[k];
    return Array.isArray(val) || typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean'
      ? `${k}Val`
      : '';
  }).filter(Boolean).join(', ');

  const cCode = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

${cRetType} solve(${cParams}) {
    // Write your code here
    return ${cRetType === 'int' || cRetType === 'double' ? '0' : 'NULL'};
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
int main() {
    char input[4096] = {0};
    char line[256];
    while (fgets(line, sizeof(line), stdin)) {
        strncat(input, line, sizeof(input) - strlen(input) - 1);
    }
    if (strlen(input) > 0) {
${cParsingLogic}
        ${cRetType === 'void' ? '' : cRetType + ' result = '}solve(${cParamsCall});
        
        // Output result
        ${cRetType === 'void' ? 'printf("success\\n");' : (cRetType === 'int' ? 'printf("%d\\n", result);' : (cRetType === 'double' ? 'printf("%f\\n", result);' : 'printf("%s\\n", result ? result : "");'))}
    }
    return 0;
}`;

  return {
    javascript: jsCode,
    python: pyCode,
    java: javaCode,
    cpp: cppCode,
    c: cCode,
  };
}
