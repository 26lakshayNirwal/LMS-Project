import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleRegister = async () => {
    const name = `${firstName} ${lastName}`.trim();
    if (!name || !email || !password) {
      alert("Please enter First Name, Last Name, Email, and Password.");
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Register failed");
        return;
      }

      navigate("/login");
    } catch {
      alert("Server error");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div
      className="vh-100"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OVERLAY */}
      <div
        className="h-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,40,24,0.95) 0%, rgba(6,40,24,0.85) 40%, rgba(0,0,0,0.2) 100%)",
        }}
      >
        {/* NAVBAR */}
        <div className="container py-3 d-flex justify-content-between align-items-center text-white">
          <div className="d-flex align-items-center">
            <div
              className="bg-white text-dark fw-bold px-2 py-1 me-2"
              style={{ borderRadius: "4px", fontSize: "12px" }}
            >
              ISFB
            </div>
            <span className="fw-bold">IMARTICUS</span>
          </div>

          <div className="d-none d-lg-flex align-items-center">
            <span className="mx-3">Home</span>
            <span className="mx-3">UG Program</span>
            <span className="mx-3">PG Program</span>
            <span className="mx-3">Life @ ISFB</span>
            <span className="mx-3">About Us</span>

            <button
              className="btn ms-3 px-4 rounded-pill"
              style={{ backgroundColor: "#c6f36a" }}
              onClick={() => navigate("/login")}
            >
              Login / Apply
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="container h-75 d-flex align-items-center">
          <div className="row w-100 align-items-center">

            {/* LEFT TEXT */}
            <div className="col-lg-6 text-white">
              <h4 style={{ color: "#c6f36a" }}>India's Only</h4>

              <h1 className="fw-bold" style={{ fontSize: "42px" }}>
                UG Program in Finance and Business that gets you{" "}
                <span style={{ color: "#c6f36a" }}>
                  Real-World Ready
                </span>
              </h1>

              <button
                className="btn mt-4 px-4 rounded-pill"
                style={{ backgroundColor: "#c6f36a" }}
              >
                Download Brochure -
              </button>

              <div className="mt-4 d-flex align-items-center">
                <span
                  className="px-3 py-1 rounded-pill me-2"
                  style={{ backgroundColor: "#0f3d2e" }}
                >
                  Round 3 Application Deadline
                </span>

                <span
                  className="px-3 py-1 rounded-pill"
                  style={{ border: "1px solid #c6f36a" }}
                >
                  30th April 2026
                </span>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-6 d-flex justify-content-end">
              <div
                className="bg-white p-4 shadow"
                style={{
                  width: "380px",
                  borderRadius: "20px",
                }}
              >
                <h4 className="fw-bold">
                  Start Your Journey in <br />
                  <span style={{ color: "#0f3d2e" }}>
                    Finance & Business
                  </span>
                </h4>

                <p className="text-muted" style={{ fontSize: "14px" }}>
                  Fill in your details below and our admissions team will guide you.
                </p>

                <div className="row">
                  <div className="col-6">
                    <input
                      className="form-control mb-2"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      className="form-control mb-2"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  className="btn w-100 text-white"
                  style={{
                    backgroundColor: "#0f3d2e",
                    borderRadius: "30px",
                  }}
                  onClick={handleRegister}
                  disabled={registerLoading}
                >
                  {registerLoading ? "Registering..." : "SUBMIT"}
                </button>

                <p className="text-center mt-2" style={{ fontSize: "13px" }}>
                  Already Registered?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Login here
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;