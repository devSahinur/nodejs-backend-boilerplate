const response = (res = {}) => {
  const responseObject = {
    code: res.statusCode,
    message: res.message,
    data: {},
  };

  if (res.type) {
    responseObject.data.type = res.type;
  }

  if (res.data) {
    responseObject.data.attributes = res.data;
  }

  if (res.token) {
    responseObject.data.token = res.tokens;
  }

  return responseObject;
};

export default response;
