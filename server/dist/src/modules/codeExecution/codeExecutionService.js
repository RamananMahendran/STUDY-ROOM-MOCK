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
    // Build the request body dynamically with base64 encoding
    const requestBody = {
        source_code: Buffer.from(payload.sourceCode).toString('base64'),
        language_id: payload.languageId,
        stdin: payload.stdin ? Buffer.from(payload.stdin).toString('base64') : '',
    };
    // Only add expected_output if it's provided
    if (payload.expectedOutput !== undefined && payload.expectedOutput !== null) {
        requestBody.expected_output = Buffer.from(payload.expectedOutput).toString('base64');
    }
    const response = await fetch(`${judge0Url}/submissions?base64_encoded=true&wait=true`, {
        method: 'POST',
        headers: judge0Headers(),
        body: JSON.stringify(requestBody),
    });
    const result = await parseJudge0Response(response);
    // Helper to decode base64
    const decodeBase64 = (str) => str ? Buffer.from(str, 'base64').toString('utf8') : null;
    // Ensure consistent response format
    return {
        stdout: decodeBase64(result.stdout),
        stderr: decodeBase64(result.stderr),
        compile_output: decodeBase64(result.compile_output),
        time: result.time || '0',
        memory: result.memory || 0,
        status: result.status || { id: 5, description: 'Runtime Error' },
        token: result.token,
        message: result.message ? Buffer.from(result.message, 'base64').toString('utf8') : null,
    };
}
