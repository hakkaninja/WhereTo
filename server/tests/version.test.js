const request = require("supertest");
const express = require("express");
const service = require("../controllers/index.js");
const router = require("../routes/version.js");

jest.mock("../controllers/index.js"); // Mock the service

const app = express();
app.use(router); // Use the router in an Express app

describe("GET /version", () => {
  it("should return version information on success", async () => {
    const mockVersion = "1.0.0";
    service.getVersion.mockResolvedValue(mockVersion);
    // Mocking the service method

    const response = await request(app).get("/version");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: mockVersion,
    });
  });

  it("should return a 404 status with an error message on failure", async () => {
    service.getVersion.mockRejectedValue(new Error("Failed to get version"));

    const response = await request(app).get("/version");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      msg: "Something happened, please try again later",
    });
  });
});
