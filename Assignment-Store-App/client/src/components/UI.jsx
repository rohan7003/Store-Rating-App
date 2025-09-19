export function Card({ title, children, actions }) {
  return (
    <div className="card">
      {title && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h3 className="heading" style={{ margin: 0 }}>
            {title}
          </h3>
          <div className="row">{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", ...props }) {
  const cls = ["btn"];
  if (variant === "secondary") cls.push("secondary");
  if (variant === "ghost") cls.push("ghost");
  return (
    <button className={cls.join(" ")} {...props}>
      {children}
    </button>
  );
}

export function Input(props) {
  return <input className="input" {...props} />;
}

export function Select(props) {
  return <select className="select" {...props} />;
}

export function Field({ label, error, help, children }) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      {children}
      {error ? (
        <div className="error">{error}</div>
      ) : help ? (
        <div className="help">{help}</div>
      ) : null}
    </div>
  );
}
