import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("API", () => {
  let token;
  let payload;
  let x_auth_token;
  let url = "https://apichallenges.herokuapp.com/";
  test.beforeAll(async ({ request }) => {
    let response = await request.post(`${url}challenger`);
    const headers = response.headers();
    expect(headers).toEqual(
      expect.objectContaining({ "x-challenger": expect.any(String) })
    );
    token = headers["x-challenger"];
    console.log(token);
  });

  test("GET /challenges @API", async ({ request }) => {
    let response = await request.get(`${url}challenges`, {
      headers: { "x-challenger": token },
    });
    const body = await response.json();
    expect(body.challenges.length).toBe(59);
    expect(response.status()).toBe(200);
  });

  test("GET /todos @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: { "x-challenger": token },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todo @API", async ({ request }) => {
    let response = await request.get(`${url}todo`, {
      headers: { "x-challenger": token },
    });
    let headers = response.headers();
    expect(response.status()).toBe(404);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todos/id @API", async ({ request }) => {
    let response = await request.get(`${url}todos/2`, {
      headers: { "x-challenger": token },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todos/{id} (404) @API", async ({ request }) => {
    let response = await request.get(`${url}todos/99`, {
      headers: { "x-challenger": token },
    });
    let headers = response.headers();
    expect(response.status()).toBe(404);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todos (200) ?filter @API", async ({ request }) => {
    let response = await request.get(`${url}/todos`, {
      headers: {
        "x-challenger": token,
      },
      params: {
        doneStatus: true,
      },
    });
    let body = await response.json();
    expect(body).toHaveProperty("todos");
    expect(response.status()).toBe(200);
  });

  test("HEAD /todos @API", async ({ request }) => {
    let response = await request.head(`${url}todos`, {
      headers: { "x-challenger": token },
    });
    expect(response.status()).toBe(200);
  });

  test("POST /todos @API", async ({ request }) => {
    const todo = {
      title: "create todo process payroll",
      doneStatus: true,
      description: "",
    };
    let response = await request.post(`${url}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(201);
  });

  test("POST /todos (400) @API", async ({ request }) => {
    const todo = {
      title: "create todo process payroll",
      doneStatus: "true",
      description: "",
    };
    let response = await request.post(`${url}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  test("POST /todos (400) title too long @API", async ({ request }) => {
    const todo = {
      title:
        "create todo process payrollcreate todo process payrollcreate todo process payrollcreate todo process payrollcreate todo process payroll",
      doneStatus: true,
      description: "",
    };
    let response = await request.post(`${url}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  test("POST /todos (400) description too long @API", async ({ request }) => {
    const todo = {
      title: "create todo process payroll",
      doneStatus: true,
      description:
        "ertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertertert",
    };
    let response = await request.post(`${url}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  test("POST /todos (201) max out content @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(50),
        doneStatus: true,
        description: faker.person.bio(200),
      },
    });
    let headers =  response.headers();
    let body = await response.json();
    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos (413) content too long @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.string.alpha(5000),
        doneStatus: true,
        description: faker.string.alpha(200),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(413);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos (400) extra @API", async ({ request }) => {
    const todo = {
      title: faker.person.bio(5),
      doneStatus: true,
      description: faker.person.bio(5),
      dsr: true,
    };
    let response = await request.post(`${url}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    let headers = await response.headers();
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PUT /todos/{id} (400) @API", async ({ request }) => {
    let response = await request.put(`${url}todos/${faker.number.int(100)}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(50),
        doneStatus: true,
        description: faker.person.bio(200),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos/{id} (200) @API", async ({ request }) => {
    let response = await request.post(`${url}todos/3`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos/{id} (404) @API", async ({ request }) => {
    let response = await request.post(`${url}todos/199`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(404);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PUT /todos/{id} full (200) @API", async ({ request }) => {
    let response = await request.put(`${url}todos/3`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        doneStatus: false,
        description: faker.person.bio(),
      },
    });

    let headers = response.headers();
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        doneStatus: false,
        description: expect.any(String),
      })
    );
  });

  test("PUT /todos/{id} partial (200) @API", async ({ request }) => {
    let response = await request.put(`${url}todos/2`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
      },
    });
    let headers = response.headers();
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        doneStatus: false,
        description: expect.any(String),
      })
    );
  });

  test("PUT /todos/{id} no title (400) @API", async ({ request }) => {
    let response = await request.put(`${url}todos/3`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        doneStatus: true,
        description: faker.person.bio(),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PUT /todos/{id} no amend id (400) @API", async ({ request }) => {
    let response = await request.put(`${url}todos/3`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        id: 125,
        title: faker.person.bio(),
        doneStatus: false,
        description: faker.person.bio(),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("DELETE /todos/{id} (200) @API", async ({ request }) => {
    let response = await request.delete(`${url}todos/3`, {
      headers: {
        "x-challenger": token,
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("OPTIONS /todos (200) @API", async ({ request }) => {
    let response = await request.fetch(`${url}todos`, {
      method: "OPTIONS",
      headers: {
        "x-challenger": token,
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("get /todos (200) XML @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: { "x-challenger": token, Accept: "application/xml" },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("get /todos (200) json @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: { "x-challenger": token, Accept: "application/json" },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("get /todos (200) any @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: { "x-challenger": token, Accept: "*/*" },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todos (200) XML @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: {
        "x-challenger": token,
        Accept: "application/xml, application/json",
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todos XML @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: { "x-challenger": token, Accept: "" },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /todos (406) @API", async ({ request }) => {
    let response = await request.get(`${url}todos`, {
      headers: { "x-challenger": token, Accept: "application/gzip" },
    });

    let headers = response.headers();
    expect(response.status()).toBe(406);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos XML @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
        Accept: "application/xml",
        "Content-Type": "application/xml",
      },
      data: `<todo>
            <title>${faker.string.alpha(50)}</title>
            <doneStatus>true</doneStatus>
            <description>${faker.string.alpha(200)}</description>
        </todo>`,
    });
    let headers = response.headers();
    expect(response.status()).toBe(201);
    expect(headers["content-type"]).toEqual("application/xml");
  });

  test("POST /todos JSON @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        description: faker.person.bio(2),
        doneStatus: true,
        title: faker.person.bio(5),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos 415 @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
        Accept: "application/json",
        "Content-Type": "ng",
      },
      data: {
        description: faker.person.bio(2),
        doneStatus: true,
        title: faker.person.bio(5),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(415);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /challenger/guid @API", async ({ request }) => {
    let response = await request.get(`${url}challenger/${token}`, {
      headers: {
        "x-challenger": token,
        Accept: "application/json",
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PUT /challenger/guid RESTORE @API", async ({ request }) => {
    let getRequest = await request.get(`${url}challenger/${token}`, {
      headers: {
        "x-challenger": token,
      },
    });
    let getBody = await getRequest.json();
    let response = await request.put(`${url}challenger/${token}`, {
      headers: {
        "x-challenger": token,
      },
      data: getBody,
    });

    let headers = response.headers();
    payload = await response.json();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PUT /challenger/guid CREATE @API", async ({ request }) => {
    await request.put(`${url}challenger/${token}`, {
      headers: {
        "x-challenger": token,
      },
      data: {},
    });
    let response = await request.put(`${url}challenger/${token}`, {
      headers: {
        "x-challenger": token,
      },
      data: payload,
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /challenger/database/guid (200) @API", async ({ request }) => {
    let response = await request.get(`${url}challenger/database/${token}`, {
      headers: {
        "x-challenger": token,
        Accept: "application/json",
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PUT /challenger/database/guid (Update) @API", async ({ request }) => {
    let getRequest = await request.get(`${url}challenger/database/${token}`, {
      headers: {
        "x-challenger": token,
      },
    });
    let getBody = await getRequest.json();
    let response = await request.put(`${url}challenger/database/${token}`, {
      headers: {
        "x-challenger": token,
      },
      data: getBody,
    });
    let headers = response.headers();
    expect(response.status()).toBe(204);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /todos XML to JSON @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
        accept: "application/json",
        "content-type": "application/xml",
      },
      data: `<?xml version="1.0" encoding="UTF-8" ?> 
        <title> "New Title"</title>
        <doneStatus>true</doneStatus>
        <description>"New description"</description>`,
    });
    expect(response.status()).toBe(201);
  });

  test("POST /todos JSON to XML @API", async ({ request }) => {
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
        accept: "application/xml",
        "content-type": "application/json",
      },
      data: {
        description: faker.string.alpha(2),
        title: faker.string.alpha(5),
      },
    });
    expect(response.status()).toBe(201);
  });

  test("DELETE /heartbeat (405)", async ({ request }) => {
    let response = await request.delete(`${url}heartbeat`, {
      headers: {
        "x-challenger": token,
      },
    });
    let headers =  response.headers();
    expect(response.status()).toBe(405);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("PATCH /heartbeat (500) @API", async ({ request }) => {
    let response = await request.patch(`${url}heartbeat`, {
      headers: {
        "x-challenger": token,
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(500);
  });

  test("TRACE /heartbeat (501) @API", async ({ request }) => {
    let response = await request.fetch(`${url}heartbeat`, {
      method: "TRACE",
      headers: {
        "x-challenger": token,
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(501);
  });

  test("GET /heartbeat (204) @API", async ({ request }) => {
    let response = await request.get(`${url}heartbeat`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(204);
  });

  test("POST /heartbeat as DELETE (405) @API", async ({ request }) => {
    let response = await request.post(`${url}heartbeat`, {
      headers: {
        "x-challenger": token,
        "X-HTTP-Method-Override": "DELETE",
      },
    });
    expect(response.status()).toBe(405);
  });

  test("POST /heartbeat as PATCH (500) @API", async ({ request }) => {
    let response = await request.post(`${url}heartbeat`, {
      headers: {
        "x-challenger": token,
        "X-HTTP-Method-Override": "PATCH",
      },
    });
    expect(response.status()).toBe(500);
  });

  test("POST /heartbeat as Trace (501) @API", async ({ request }) => {
    let response = await request.post(`${url}heartbeat`, {
      headers: {
        "x-challenger": token,
        "X-HTTP-Method-Override": "TRACE",
      },
    });
    expect(response.status()).toBe(501);
  });

  test("POST /secret/token (401) @API", async ({ request }) => {
    let response = await request.post(`${url}secret/token`, {
      headers: {
        "x-challenger": token,
        authorization: "Basic YWRtaW46cGFzc3dvcmQxMTE=",
      },
    });

    let headers = response.headers();
    expect(response.status()).toBe(401);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("POST /secret/token (201) @API", async ({ request }) => {
    let response = await request.post(`${url}secret/token`, {
      headers: {
        "x-challenger": token,
        authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
      },
    });

    let headers = response.headers();
    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    x_auth_token = headers["x-auth-token"];
  });

  test("GET /secret/note (403) @API", async ({ request }) => {
    let response = await request.get(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
        "X-AUTH-TOKEN": "wrong_token",
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(403);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /secret/note (401) @API", async ({ request }) => {
    let response = await request.get(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(401);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });

  test("GET /secret/note (200) @API", async ({ request }) => {
    let response = await request.get(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
        "X-AUTH-TOKEN": x_auth_token,
      },
    });

    expect(response.status()).toBe(200);
  });

  test("POST /secret/note (200) @API", async ({ request }) => {
    let response = await request.post(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
        "X-AUTH-TOKEN": x_auth_token,
      },
      data: {
        note: faker.person.bio(),
      },
    });
    expect(response.status()).toBe(200);
  });

  test("POST /secret/note (401) @API", async ({ request }) => {
    let response = await request.post(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        note: faker.person.bio(),
      },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /secret/note (403)@API", async ({ request }) => {
    let response = await request.post(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
        "X-AUTH-TOKEN": "wrong_token",
      },
      data: {
        note: faker.person.bio(),
      },
    });
    expect(response.status()).toBe(403);
  });

  test("GET /secret/note (Bearer)@API", async ({ request }) => {
    let response = await request.get(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
        Authorization: `Bearer ${x_auth_token}`,
      },
    });
    expect(response.status()).toBe(200);
  });

  test(" POST /secret/note (Bearer) @API", async ({ request }) => {
    let response = await request.post(`${url}secret/note`, {
      headers: {
        "x-challenger": token,
        "X-AUTH-TOKEN": x_auth_token,
        Authorization: `Bearer ${x_auth_token}`,
      },
      data: {
        note: faker.person.bio(),
      },
    });
    expect(response.status()).toBe(200);
  });

  test("DELETE /todos/{id} (200) all @API", async ({ request }) => {
    let responseTodos = await request.get(`${url}todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    let idNum = (await responseTodos.json())["todos"];
    for (let index = 0; index < idNum.length; index++) {
      let response = await request.delete(`${url}todos/${idNum[index]["id"]}`, {
        headers: {
          "x-challenger": token,
        },
      });
      let headers = response.headers();
      expect(response.status()).toBe(200);
      expect(headers).toEqual(
        expect.objectContaining({ "x-challenger": token })
      );
    }
  });

  test("POST /todos (201) all @API	", async ({ request }) => {
    for (let index = 0; index < 20; index++) {
      let response = await request.post(`${url}todos`, {
        headers: {
          "x-challenger": token,
        },
        data: {
          title: faker.person.bio(),
          doneStatus: true,
          description: faker.person.bio(),
        },
      });
      let headers = response.headers();
      expect(response.status()).toBe(201);
      expect(headers).toEqual(
        expect.objectContaining({ "x-challenger": token })
      );
    }
    let response = await request.post(`${url}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.person.bio(),
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
  });
});
