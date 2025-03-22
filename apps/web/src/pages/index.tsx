import { useRouter } from "next/router";
import React from "react";

const HomePage = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Accueil</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigateTo("/auth")}>
          Auth
        </button>
        <button style={styles.button} onClick={() => navigateTo("/clients")}>
          Clients
        </button>
        <button style={styles.button} onClick={() => navigateTo("/admin")}>
          Admin
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "2rem",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "1px",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
};

export default HomePage;
