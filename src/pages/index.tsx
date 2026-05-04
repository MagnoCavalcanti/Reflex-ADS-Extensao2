import { Link } from "react-router";
import cienciasComputImg from "../assets/cienciasComput.png";
import calculadoraImg from "../assets/fiveicon_calculadora.png";
import { useAuth } from "../contexts/AuthContext";

export default function IndexPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="relative min-h-screen overflow-hidden bg-[#0a0a14] text-white"
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0;   }
        }

        .fade-up-1 { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease both; }

        .card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
        }
        .btn-primary:active { transform: scale(0.97); }

        .btn-secondary {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(109,40,217,0.25) 0%, transparent 70%)",
            position: "absolute",
            top: -150,
            left: -150,
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
            position: "absolute",
            top: 200,
            right: -100,
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 70%)",
            position: "absolute",
            bottom: 100,
            left: "40%",
            animation: "float 12s ease-in-out infinite",
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <span
          style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}
        >
          Reflex <span style={{ color: "#facc15" }}>ADS</span>
        </span>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999,
                padding: "6px 16px",
              }}
            >
              Olá, {user?.username}
            </span>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  textDecoration: "none",
                }}
                className="btn-secondary"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0a0a14",
                  background: "#facc15",
                  padding: "8px 20px",
                  borderRadius: 999,
                  textDecoration: "none",
                }}
                className="btn-primary"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-20 text-center">
        <div className="fade-up-1 mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#a78bfa",
              display: "inline-block",
              animation: "pulse-ring 1.5s ease-out infinite",
            }}
          />
          <span style={{ fontSize: 13, color: "#c4b5fd" }}>Plataforma Reflex - ADS</span>
        </div>

        <h1
          className="fade-up-2 mb-6 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-1.5px" }}
        >
          Aprenda mais rápido.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #facc15 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Evolua de verdade.
          </span>
        </h1>

        <p
          className="fade-up-3 mx-auto mb-10 max-w-xl leading-relaxed"
          style={{ fontSize: 18, color: "rgba(255,255,255,0.55)" }}
        >
          Exercícios, quizzes e simuladores pensados para as diversas áreas da tecnologia.
        </p>

        <div className="fade-up-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/cadastro"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
            }}
            className="btn-primary"
          >
            Começar agora
            <span style={{ fontSize: 18 }}>→</span>
          </Link>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 500,
              fontSize: 15,
              textDecoration: "none",
            }}
            className="btn-secondary"
          >
            Já tenho conta
          </Link>
        </div>
      </header>

      {/* Stats bar */}
      <div
        className="relative z-10 mx-auto mb-20 max-w-3xl px-6"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        {[
          { value: "3", label: "Áreas de estudo" },
          { value: "100%", label: "Gratuito" },
          { value: "ADS", label: "Feito para o curso" },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: "20px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#fff", margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <section className="relative z-10 mx-auto mb-24 max-w-5xl px-6">
        <p style={{ fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 32, textTransform: "uppercase" }}>
          O que você encontra aqui
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: (
                <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "#818cf8" }}>&lt;/&gt;</span>
              ),
              title: "Lógica de programação",
              desc: "Algoritmos, estruturas de controle e resolução de problemas com materiais interativos.",
              items: ["Fluxogramas interativos", "Pseudocódigo visual", "Exercícios práticos"],
              accent: "rgba(129,140,248,0.15)",
              border: "rgba(129,140,248,0.2)",
            },
            {
              icon: <img src={calculadoraImg} alt="" style={{ width: 36, height: 36 }} />,
              title: "Matemática",
              desc: "Conceitos aplicados à computação, com visualizações e exercícios guiados.",
              items: ["Álgebra linear", "Estatística", "Matemática discreta"],
              accent: "rgba(250,204,21,0.1)",
              border: "rgba(250,204,21,0.2)",
            },
            {
              icon: <img src={cienciasComputImg} alt="" style={{ width: 36, height: 36 }} />,
              title: "Ciências da computação",
              desc: "Fundamentos, estruturas de dados e noções de complexidade.",
              items: ["Estrutura de dados", "Complexidade", "Teoria da computação"],
              accent: "rgba(52,211,153,0.1)",
              border: "rgba(52,211,153,0.2)",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="card-hover rounded-2xl p-7"
              style={{
                background: `linear-gradient(135deg, ${card.accent}, rgba(255,255,255,0.03))`,
                border: `1px solid ${card.border}`,
              }}
            >
              <div style={{ marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 20px" }}>
                {card.desc}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {card.items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section
        className="relative z-10 mx-auto mb-20 max-w-2xl px-6 py-14 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15))",
          border: "1px solid rgba(139,92,246,0.25)",
          borderRadius: 24,
        }}
      >
        <h2
          style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}
        >
          Pronto para começar?
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 28px" }}>
          Crie sua conta gratuitamente e acesse todo o conteúdo agora.
        </p>
        <Link
          to="/cadastro"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 32px",
            borderRadius: 999,
            background: "#fff",
            color: "#1e1b4b",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
          className="btn-primary"
        >
          Criar conta grátis →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 10, textAlign: "center", paddingBottom: 32, fontSize: 13, color: "rgba(255,255,255,0.2)" }}>
        Reflex ADS · IFPB
      </footer>
    </main>
  );
}