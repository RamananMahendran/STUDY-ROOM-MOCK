// Use public Judge0 API by default, but allow override via env
const judge0Url = (process.env.JUDGE0_URL || 'https://ce.judge0.com').replace(/\/$/, '');
console.log(`Using Judge0 API at: ${judge0Url}`);
const judge0Headers = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (process.env.JUDGE0_AUTH_TOKEN) {
        headers['X-Auth-Token'] = process.env.JUDGE0_AUTH_TOKEN;
    }
    return headers;
};
const parseJudge0Response = async (response) => {
    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Judge0 returned HTTP ${response.status}: ${text}`);
    }
    try {
        const body = text ? JSON.parse(text) : null;
        return body;
    }
    catch (e) {
        throw new Error(`Failed to parse Judge0 response: ${text}`);
    }
};
export async function getJudge0Languages() {
    const response = await fetch(`${judge0Url}/languages`, {
        headers: judge0Headers(),
    });
    return parseJudge0Response(response);
}
export async function runJudge0Submission(payload) {
    // Build the request body dynamically
    const requestBody = {
        source_code: payload.sourceCode,
        language_id: payload.languageId,
        stdin: payload.stdin || '',
    };
    // Only add expected_output if it's provided (for single-run tests, not for submissions)
    if (payload.expectedOutput !== undefined && payload.expectedOutput !== null) {
        requestBody.expected_output = payload.expectedOutput;
    }
    const response = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: judge0Headers(),
        body: JSON.stringify(requestBody),
    });
    const result = await parseJudge0Response(response);
    // Ensure consistent response format
    return {
        stdout: result.stdout || null,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        time: result.time || '0',
        memory: result.memory || 0,
        status: result.status || { id: 5, description: 'Runtime Error' },
        token: result.token,
        message: result.message,
    };
}
