type Judge0SubmissionRequest = {
  sourceCode: string;
  languageId: number;
  stdin?: string;
  expectedOutput?: string;
};

const judge0Url = (process.env.JUDGE0_URL || 'http://127.0.0.1:2358').replace(/\/$/, '');

const judge0Headers = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers['X-Auth-Token'] = process.env.JUDGE0_AUTH_TOKEN;
  }

  return headers;
};

const parseJudge0Response = async (response: Response) => {
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`Judge0 returned HTTP ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
};

export async function getJudge0Languages() {
  const response = await fetch(`${judge0Url}/languages`, {
    headers: judge0Headers(),
  });

  return parseJudge0Response(response);
}

export async function runJudge0Submission(payload: Judge0SubmissionRequest) {
  const response = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: judge0Headers(),
    body: JSON.stringify({
      source_code: payload.sourceCode,
      language_id: payload.languageId,
      stdin: payload.stdin || '',
      expected_output: payload.expectedOutput,
    }),
  });

  return parseJudge0Response(response);
}
