const ENDPOINT =
  "http://ec2-18-222-239-12.us-east-2.compute.amazonaws.com:8080";

export default function loginService({ email, password }) {
  return fetch(`${ENDPOINT}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      console.log(res.status);
      if (res.status === 401) {
        return {
          ok: false,
          message:
            "Credenciales invalidas , por favor verifique la información proporcionada",
        };
      }
      if (!res.ok) throw new Error("response is Not ok");
      return res.json();
    })
    .then((res) => {
      if (res.ok === false) {
        return res;
      } else {
        const { jwt } = res;
        return { ok: true, jwt };
      }
    });
}
