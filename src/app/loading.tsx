export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF8F3",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "2px solid #E8E0D1",
          borderTopColor: "#A6843E",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
