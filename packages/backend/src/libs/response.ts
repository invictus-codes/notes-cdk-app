type TBody = Record<string, unknown> | Record<string, unknown>[] | undefined

export const success = (body: TBody) => {
  return buildResponse(200, body);
};

export const failure = (body: TBody) => {
  return buildResponse(500, body);
};

const buildResponse = (statusCode: number, body: TBody) => ({
  statusCode: statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(body),
});
